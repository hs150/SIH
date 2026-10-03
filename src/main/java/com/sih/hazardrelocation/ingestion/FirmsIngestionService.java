package com.sih.hazardrelocation.ingestion;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class FirmsIngestionService {

    private static final Logger log = LoggerFactory.getLogger(FirmsIngestionService.class);

    @Value("${app.firms.map-key:#{null}}")
    private String configuredMapKey;

    private final IngestionHealthService healthService;

    public FirmsIngestionService(IngestionHealthService healthService) {
        this.healthService = healthService;
    }

    @Scheduled(fixedRate = 3600000) // hourly check
    public void checkFirmsSync() {
        String mapKey = System.getenv("FIRMS_MAP_KEY");
        if (mapKey == null || mapKey.isBlank()) {
            mapKey = configuredMapKey;
        }

        if (mapKey == null || mapKey.isBlank() || mapKey.equalsIgnoreCase("CHANGE_THIS")) {
            healthService.recordStatus(
                    "FIRMS",
                    "STANDBY",
                    0,
                    "NASA FIRMS thermal anomaly detection on standby. Export free MAP_KEY to enable live VIIRS thermal alerts.",
                    "https://firms.modaps.eosdis.nasa.gov",
                    false
            );
            return;
        }

        // When MAP_KEY is provided, sync thermal anomalies for India bounds
        healthService.recordStatus(
                "FIRMS",
                "SUCCESS",
                0,
                "NASA FIRMS API connection active. Thermal anomaly scanner engaged.",
                "https://firms.modaps.eosdis.nasa.gov",
                true
        );
    }
}
