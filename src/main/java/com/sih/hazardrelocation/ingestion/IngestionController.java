package com.sih.hazardrelocation.ingestion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/ingestion")
public class IngestionController {

    private final IngestionHealthService healthService;
    private final UsgsIngestionService usgsIngestionService;
    private final OpenMeteoIngestionService openMeteoIngestionService;

    public IngestionController(
            IngestionHealthService healthService,
            UsgsIngestionService usgsIngestionService,
            OpenMeteoIngestionService openMeteoIngestionService
    ) {
        this.healthService = healthService;
        this.usgsIngestionService = usgsIngestionService;
        this.openMeteoIngestionService = openMeteoIngestionService;
    }

    @GetMapping("/status")
    public ResponseEntity<Collection<IngestionStatus>> getIngestionStatus() {
        return ResponseEntity.ok(healthService.getAllStatuses());
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> triggerManualSync() {
        int usgsEvents = usgsIngestionService.syncUsgsSeismicData();
        int meteoAlerts = openMeteoIngestionService.syncAtmosphericHazards();

        return ResponseEntity.ok(Map.of(
                "status", "COMPLETED",
                "usgsEventsIngested", usgsEvents,
                "meteoAlertsActive", meteoAlerts,
                "totalLiveIncidents", usgsEvents + meteoAlerts,
                "health", healthService.getAllStatuses()
        ));
    }
}
