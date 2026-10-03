package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.entity.HazardEvent;
import com.sih.hazardrelocation.entity.RedZone;
import com.sih.hazardrelocation.repository.HazardEventRepository;
import com.sih.hazardrelocation.repository.RedZoneRepository;
import org.locationtech.jts.geom.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/field-reports")
public class FieldReportController {

    private final HazardEventRepository hazardEventRepository;
    private final RedZoneRepository redZoneRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public FieldReportController(
            HazardEventRepository hazardEventRepository,
            RedZoneRepository redZoneRepository
    ) {
        this.hazardEventRepository = hazardEventRepository;
        this.redZoneRepository = redZoneRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFieldReport(@RequestBody Map<String, Object> payload) {
        String hazardType = (String) payload.getOrDefault("hazardType", "LANDSLIDE");
        String reporter = (String) payload.getOrDefault("reporterName", "Field Rescue Officer");
        String notes = (String) payload.getOrDefault("description", "Ground SOS report");
        double lat = Double.parseDouble(payload.getOrDefault("latitude", "30.45").toString());
        double lon = Double.parseDouble(payload.getOrDefault("longitude", "79.35").toString());
        int casualties = Integer.parseInt(payload.getOrDefault("affectedCount", "0").toString());

        Point pt = geometryFactory.createPoint(new Coordinate(lon, lat));
        String extId = "FIELD-SOS-" + UUID.randomUUID().toString().substring(0, 8);

        HazardEvent hazard = HazardEvent.builder()
                .hazardType(hazardType.toUpperCase())
                .severity(85.0)
                .eventDate(LocalDate.now())
                .source("MANUAL_FIELD_REPORT")
                .externalId(extId)
                .description(String.format("FIELD SOS: %s [Reported by %s, ~%d casualties]. %s", hazardType, reporter, casualties, notes))
                .geometry(pt)
                .fetchedAt(LocalDateTime.now())
                .build();
        hazardEventRepository.save(hazard);

        // Immediate dynamic Red Zone containment buffer
        Geometry buffer = pt.buffer(0.05); // ~5km radius
        MultiPolygon mp = (buffer instanceof MultiPolygon) ? (MultiPolygon) buffer : geometryFactory.createMultiPolygon(new Polygon[]{(Polygon) buffer});

        RedZone rz = RedZone.builder()
                .name("SOS Containment Perimeter: " + extId)
                .hazardType(hazardType.toUpperCase())
                .riskLevel("CRITICAL")
                .reason(String.format("Immediate field SOS logged by %s at (%.3f, %.3f)", reporter, lat, lon))
                .source("MANUAL_FIELD_REPORT")
                .externalId("RZ-" + extId)
                .geometry(mp)
                .active(true)
                .fetchedAt(LocalDateTime.now())
                .build();
        redZoneRepository.save(rz);

        return ResponseEntity.ok(Map.of(
                "status", "RECORDED",
                "sosId", extId,
                "hazardType", hazardType,
                "message", "Field SOS recorded successfully. Dynamic Red Zone buffer dispatched to command map."
        ));
    }
}
