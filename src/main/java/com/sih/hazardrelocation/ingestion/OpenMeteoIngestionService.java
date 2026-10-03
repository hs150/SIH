package com.sih.hazardrelocation.ingestion;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.entity.HazardEvent;
import com.sih.hazardrelocation.entity.RedZone;
import com.sih.hazardrelocation.repository.HabitationRepository;
import com.sih.hazardrelocation.repository.HazardEventRepository;
import com.sih.hazardrelocation.repository.RedZoneRepository;
import org.locationtech.jts.geom.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OpenMeteoIngestionService {

    private static final Logger log = LoggerFactory.getLogger(OpenMeteoIngestionService.class);

    // IMD (India Meteorological Department) thresholds:
    // Heavy rainfall: 64.5 mm to 115.5 mm per day
    // Very heavy: 115.6 mm to 204.4 mm per day
    // Extremely heavy / Cloudburst trigger: > 204.4 mm per day
    public static final double IMD_HEAVY_RAIN_THRESHOLD_MM = 64.5;
    public static final double IMD_CLOUDBURST_THRESHOLD_MM = 100.0;

    private final HabitationRepository habitationRepository;
    private final HazardEventRepository hazardEventRepository;
    private final RedZoneRepository redZoneRepository;
    private final IngestionHealthService healthService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public OpenMeteoIngestionService(
            HabitationRepository habitationRepository,
            HazardEventRepository hazardEventRepository,
            RedZoneRepository redZoneRepository,
            IngestionHealthService healthService
    ) {
        this.habitationRepository = habitationRepository;
        this.hazardEventRepository = hazardEventRepository;
        this.redZoneRepository = redZoneRepository;
        this.healthService = healthService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("Triggering initial Open-Meteo precipitation assessment on startup...");
        syncAtmosphericHazards();
    }

    // Run every 15 minutes
    @Scheduled(fixedRate = 900000)
    public void scheduledSync() {
        syncAtmosphericHazards();
    }

    @Transactional
    public int syncAtmosphericHazards() {
        List<Habitation> habitations = habitationRepository.findAll();
        int alertCount = 0;
        int checkedCount = 0;

        if (habitations.isEmpty()) {
            healthService.recordStatus("OPEN_METEO", "STANDBY", 0, "No habitations registered to scan for rainfall triggers", "https://api.open-meteo.com", true);
            return 0;
        }

        try {
            // Batch sample by habitations (limiting to top 10 unique coordinates to conserve free tier quota)
            for (Habitation h : habitations) {
                if (h.getGeometry() == null || h.getGeometry().getCoordinate() == null) continue;
                if (checkedCount >= 8) break; // stay within rate limits

                double lon = h.getGeometry().getCoordinate().getX();
                double lat = h.getGeometry().getCoordinate().getY();
                checkedCount++;

                String url = String.format(
                        "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&daily=precipitation_sum,precipitation_hours&hourly=precipitation&timezone=auto",
                        lat, lon
                );

                try {
                    String json = restTemplate.getForObject(url, String.class);
                    if (json == null) continue;

                    JsonNode root = objectMapper.readTree(json);
                    JsonNode daily = root.path("daily");
                    JsonNode precipSumArray = daily.path("precipitation_sum");

                    double todayPrecipMm = 0.0;
                    if (precipSumArray.isArray() && precipSumArray.size() > 0) {
                        todayPrecipMm = precipSumArray.get(0).asDouble(0.0);
                    }

                    // Also check peak hourly rate
                    JsonNode hourlyPrecip = root.path("hourly").path("precipitation");
                    double maxHourlyPrecip = 0.0;
                    if (hourlyPrecip.isArray()) {
                        for (int i = 0; i < Math.min(24, hourlyPrecip.size()); i++) {
                            maxHourlyPrecip = Math.max(maxHourlyPrecip, hourlyPrecip.get(i).asDouble(0.0));
                        }
                    }

                    boolean isHeavy = todayPrecipMm >= IMD_HEAVY_RAIN_THRESHOLD_MM || maxHourlyPrecip >= 15.0;

                    if (isHeavy) {
                        String hazardType = todayPrecipMm >= IMD_CLOUDBURST_THRESHOLD_MM ? "CLOUDBURST" : "FLASH_FLOOD";
                        String externalId = String.format("OPENMETEO-%s-%s-%s", hazardType, LocalDate.now(), h.getId());

                        double severity = Math.min(100.0, 50.0 + (todayPrecipMm * 0.4));
                        Point pt = geometryFactory.createPoint(new Coordinate(lon, lat));

                        Optional<HazardEvent> existing = hazardEventRepository.findByExternalId(externalId);
                        HazardEvent hazard = existing.orElseGet(HazardEvent::new);
                        hazard.setExternalId(externalId);
                        hazard.setHazardType(hazardType);
                        hazard.setSeverity(severity);
                        hazard.setEventDate(LocalDate.now());
                        hazard.setSource("OPEN_METEO");
                        hazard.setDescription(String.format("Open-Meteo live rainfall: %.1f mm/day (Peak: %.1f mm/h) over %s [%s]",
                                todayPrecipMm, maxHourlyPrecip, h.getName(), h.getDistrict()));
                        hazard.setGeometry(pt);
                        hazard.setFetchedAt(LocalDateTime.now());
                        hazardEventRepository.save(hazard);

                        // Generate Flood Inundation Red Zone
                        String rzExternalId = "RZ-METEO-" + externalId;
                        Geometry bufferGeom = pt.buffer(0.08); // ~9km flood dispersion zone
                        MultiPolygon multiPolygon = toMultiPolygon(bufferGeom);

                        Optional<RedZone> existingRz = redZoneRepository.findByExternalId(rzExternalId);
                        RedZone redZone = existingRz.orElseGet(RedZone::new);
                        redZone.setName("Flood Inundation Perimeter: " + h.getName());
                        redZone.setHazardType(hazardType);
                        redZone.setRiskLevel(todayPrecipMm >= IMD_CLOUDBURST_THRESHOLD_MM ? "CRITICAL" : "HIGH");
                        redZone.setReason(String.format("Live Open-Meteo telemetry: %.1fmm precipitation exceeding IMD danger threshold", todayPrecipMm));
                        redZone.setSource("OPEN_METEO");
                        redZone.setExternalId(rzExternalId);
                        redZone.setGeometry(multiPolygon);
                        redZone.setActive(true);
                        redZone.setFetchedAt(LocalDateTime.now());
                        redZoneRepository.save(redZone);

                        alertCount++;
                    }
                } catch (Exception locEx) {
                    log.debug("Weather sample failed for {}: {}", h.getName(), locEx.getMessage());
                }
            }

            String msg = String.format("%d habitation clusters monitored. %d precipitation danger alerts active.", checkedCount, alertCount);
            healthService.recordStatus("OPEN_METEO", "SUCCESS", alertCount, msg, "https://api.open-meteo.com", true);
            log.info(msg);

        } catch (Exception e) {
            log.error("Failed to run Open-Meteo atmospheric sync: {}", e.getMessage());
            healthService.recordStatus("OPEN_METEO", "FAILED", 0, "Atmospheric sync failed: " + e.getMessage(), "https://api.open-meteo.com", true);
        }

        return alertCount;
    }

    private MultiPolygon toMultiPolygon(Geometry geom) {
        if (geom instanceof MultiPolygon mp) {
            return mp;
        } else if (geom instanceof Polygon p) {
            return geometryFactory.createMultiPolygon(new Polygon[]{p});
        }
        return null;
    }
}
