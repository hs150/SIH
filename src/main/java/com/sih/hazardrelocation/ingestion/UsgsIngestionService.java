package com.sih.hazardrelocation.ingestion;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.hazardrelocation.entity.HazardEvent;
import com.sih.hazardrelocation.entity.RedZone;
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

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class UsgsIngestionService {

    private static final Logger log = LoggerFactory.getLogger(UsgsIngestionService.class);

    private final HazardEventRepository hazardEventRepository;
    private final RedZoneRepository redZoneRepository;
    private final IngestionHealthService healthService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public UsgsIngestionService(
            HazardEventRepository hazardEventRepository,
            RedZoneRepository redZoneRepository,
            IngestionHealthService healthService
    ) {
        this.hazardEventRepository = hazardEventRepository;
        this.redZoneRepository = redZoneRepository;
        this.healthService = healthService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // Auto-sync on startup
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("Triggering initial USGS live ingestion on startup...");
        syncUsgsSeismicData();
    }

    // Sync every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void scheduledSync() {
        syncUsgsSeismicData();
    }

    @Transactional
    public int syncUsgsSeismicData() {
        // Query USGS FDSN API for South Asia / India bounding box (Lat 6 to 37, Lon 68 to 97)
        // or global past day feed as fallback
        String primaryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97";
        String fallbackUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

        int count = 0;
        try {
            String json;
            try {
                json = restTemplate.getForObject(primaryUrl, String.class);
            } catch (Exception e) {
                log.warn("USGS primary FDSN endpoint timeout/error ({}), falling back to global summary feed...", e.getMessage());
                json = restTemplate.getForObject(fallbackUrl, String.class);
            }

            if (json == null) {
                healthService.recordStatus("USGS", "WARNING", 0, "Empty payload received from USGS", primaryUrl, true);
                return 0;
            }

            JsonNode root = objectMapper.readTree(json);
            JsonNode features = root.path("features");

            if (!features.isArray()) {
                healthService.recordStatus("USGS", "WARNING", 0, "No features array in USGS feed", primaryUrl, true);
                return 0;
            }

            for (JsonNode feature : features) {
                String externalId = feature.path("id").asText();
                if (externalId.isEmpty()) continue;

                JsonNode properties = feature.path("properties");
                double mag = properties.path("mag").asDouble(0.0);
                String place = properties.path("place").asText("Seismic tremor");
                long timeEpoch = properties.path("time").asLong(System.currentTimeMillis());
                LocalDate eventDate = Instant.ofEpochMilli(timeEpoch).atZone(ZoneId.systemDefault()).toLocalDate();

                JsonNode coords = feature.path("geometry").path("coordinates");
                if (!coords.isArray() || coords.size() < 2) continue;

                double lon = coords.get(0).asDouble();
                double lat = coords.get(1).asDouble();

                // If fallback feed was used, verify bounding box is in region
                if (lat < 5 || lat > 40 || lon < 65 || lon > 100) {
                    continue; // Skip out-of-region events
                }

                // Severity formula: Mag 3 = 45, Mag 5 = 75, Mag 6.5+ = 98
                double severity = Math.min(100.0, Math.max(20.0, mag * 15.0));

                Point pt = geometryFactory.createPoint(new Coordinate(lon, lat));

                // Upsert HazardEvent
                Optional<HazardEvent> existingHazard = hazardEventRepository.findByExternalId(externalId);
                HazardEvent hazard = existingHazard.orElseGet(HazardEvent::new);
                hazard.setExternalId(externalId);
                hazard.setHazardType("EARTHQUAKE");
                hazard.setSeverity(severity);
                hazard.setEventDate(eventDate);
                hazard.setSource("USGS");
                hazard.setDescription(String.format("USGS Seismic M%.1f — %s", mag, place));
                hazard.setGeometry(pt);
                hazard.setFetchedAt(LocalDateTime.now());
                hazardEventRepository.save(hazard);

                // Auto-generate containment Red Zone buffer if magnitude >= 3.0
                if (mag >= 3.0) {
                    // Buffer radius in degrees (~11km per 0.1 deg)
                    double bufferDeg = mag >= 5.0 ? 0.20 : 0.10;
                    Geometry bufferGeom = pt.buffer(bufferDeg);
                    MultiPolygon multiPolygon = toMultiPolygon(bufferGeom);

                    String rzExternalId = "RZ-USGS-" + externalId;
                    Optional<RedZone> existingRz = redZoneRepository.findByExternalId(rzExternalId);
                    RedZone redZone = existingRz.orElseGet(RedZone::new);
                    redZone.setName("Seismic Hazard Perimeter: " + externalId);
                    redZone.setHazardType("EARTHQUAKE");
                    redZone.setRiskLevel(mag >= 5.0 ? "CRITICAL" : "HIGH");
                    redZone.setReason(String.format("Live USGS event (M%.1f) dynamic buffer at (%.3f, %.3f)", mag, lat, lon));
                    redZone.setSource("USGS");
                    redZone.setExternalId(rzExternalId);
                    redZone.setGeometry(multiPolygon);
                    redZone.setActive(true);
                    redZone.setFetchedAt(LocalDateTime.now());
                    redZoneRepository.save(redZone);
                }

                count++;
            }

            log.info("Successfully ingested {} live seismic events from USGS", count);
            healthService.recordStatus("USGS", "SUCCESS", count, String.format("%d live events synchronized from USGS FDSN API", count), primaryUrl, true);
        } catch (Exception e) {
            log.error("Failed to ingest USGS feed: {}", e.getMessage());
            healthService.recordStatus("USGS", "FAILED", 0, "Sync error: " + e.getMessage(), primaryUrl, true);
        }

        return count;
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
