package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.entity.HazardEvent;
import com.sih.hazardrelocation.entity.RedZone;
import com.sih.hazardrelocation.entity.RelocationSite;
import com.sih.hazardrelocation.repository.HabitationRepository;
import com.sih.hazardrelocation.repository.HazardEventRepository;
import com.sih.hazardrelocation.repository.RedZoneRepository;
import com.sih.hazardrelocation.repository.RelocationSiteRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final RedZoneRepository redZoneRepository;
    private final RelocationSiteRepository relocationSiteRepository;
    private final HabitationRepository habitationRepository;
    private final HazardEventRepository hazardEventRepository;

    public ExportController(
            RedZoneRepository redZoneRepository,
            RelocationSiteRepository relocationSiteRepository,
            HabitationRepository habitationRepository,
            HazardEventRepository hazardEventRepository
    ) {
        this.redZoneRepository = redZoneRepository;
        this.relocationSiteRepository = relocationSiteRepository;
        this.habitationRepository = habitationRepository;
        this.hazardEventRepository = hazardEventRepository;
    }

    /**
     * Standard RFC 7946 GeoJSON FeatureCollection export.
     * Ready for direct drag-and-drop ingestion into QGIS, ArcGIS, or Google Earth.
     */
    @GetMapping(value = "/gis/geojson", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> exportGeoJson() {
        List<Map<String, Object>> features = new ArrayList<>();

        // Add Red Zones as Polygon / MultiPolygon features
        for (RedZone rz : redZoneRepository.findByActiveTrue()) {
            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");
            feature.put("properties", Map.of(
                    "id", rz.getId().toString(),
                    "name", rz.getName(),
                    "hazardType", rz.getHazardType(),
                    "riskLevel", rz.getRiskLevel(),
                    "source", rz.getSource() != null ? rz.getSource() : "MANUAL_FIELD_REPORT",
                    "reason", rz.getReason() != null ? rz.getReason() : ""
            ));

            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "MultiPolygon");
            geometry.put("coordinates", rz.getCoordinates());
            feature.put("geometry", geometry);
            features.add(feature);
        }

        // Add Relocation Sites as Point features
        for (RelocationSite rs : relocationSiteRepository.findByActiveTrue()) {
            if (rs.getGeometry() == null || rs.getGeometry().getCoordinate() == null) continue;
            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");
            feature.put("properties", Map.of(
                    "id", rs.getId().toString(),
                    "name", rs.getName(),
                    "type", "SAFE_RELOCATION_SITE",
                    "capacity", rs.getMaxCapacity() != null ? rs.getMaxCapacity() : 0,
                    "district", rs.getDistrict() != null ? rs.getDistrict() : ""
            ));
            feature.put("geometry", Map.of(
                    "type", "Point",
                    "coordinates", List.of(
                            rs.getGeometry().getCoordinate().getX(),
                            rs.getGeometry().getCoordinate().getY()
                    )
            ));
            features.add(feature);
        }

        Map<String, Object> geoJson = new LinkedHashMap<>();
        geoJson.put("type", "FeatureCollection");
        geoJson.put("name", "AASHRAYA_GIS_Export_" + System.currentTimeMillis());
        geoJson.put("crs", Map.of(
                "type", "name",
                "properties", Map.of("name", "urn:ogc:def:crs:OGC:1.3:CRS84")
        ));
        geoJson.put("features", features);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"aashraya_gis_layers.geojson\"")
                .body(geoJson);
    }

    /**
     * DDMA (District Disaster Management Authority) Official Action Plan Brief
     */
    @GetMapping("/action-plan/summary")
    public ResponseEntity<Map<String, Object>> getActionPlanSummary() {
        List<Habitation> habitations = habitationRepository.findAll();
        List<RedZone> redZones = redZoneRepository.findByActiveTrue();
        List<RelocationSite> sites = relocationSiteRepository.findByActiveTrue();
        List<HazardEvent> hazards = hazardEventRepository.findAll();

        int totalPop = habitations.stream().mapToInt(h -> h.getPopulation() != null ? h.getPopulation() : 0).sum();
        int totalCapacity = sites.stream().mapToInt(s -> s.getMaxCapacity() != null ? s.getMaxCapacity() : 0).sum();

        Map<String, Object> plan = new LinkedHashMap<>();
        plan.put("documentTitle", "DDMA DISTRICT DISASTER RELOCATION & SHELTER ACTION PLAN");
        plan.put("generatedAt", LocalDateTime.now().toString());
        plan.put("classification", "OFFICIAL / DISASTER DECISION SUPPORT PORTAL");
        plan.put("totalVulnerableHabitations", habitations.size());
        plan.put("totalDisplacedPopulation", totalPop);
        plan.put("totalSafeRelocationSites", sites.size());
        plan.put("totalSafeCapacityHeadroom", totalCapacity);
        plan.put("capacitySurplusDeficit", totalCapacity - totalPop);
        plan.put("activeRedZonesCount", redZones.size());
        plan.put("verifiedHazardIncidents", hazards.size());

        return ResponseEntity.ok(plan);
    }
}
