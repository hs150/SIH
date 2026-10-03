package com.sih.hazardrelocation.ingestion;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IngestionHealthService {

    private final Map<String, IngestionStatus> healthMap = new ConcurrentHashMap<>();

    public IngestionHealthService() {
        // Initialize default honest states
        recordStatus("USGS", "PENDING", 0, "Initializing automated seismic feed...", "https://earthquake.usgs.gov", true);
        recordStatus("OPEN_METEO", "PENDING", 0, "Initializing live atmospheric radar...", "https://api.open-meteo.com", true);
        recordStatus("FIRMS", "STANDBY", 0, "NASA Thermal feed in standby mode (FIRMS_MAP_KEY optional)", "https://firms.modaps.eosdis.nasa.gov", false);
    }

    public void recordStatus(String source, String status, int records, String message, String endpoint, boolean live) {
        healthMap.put(source, IngestionStatus.builder()
                .source(source)
                .status(status)
                .lastSyncTime(LocalDateTime.now())
                .recordsIngested(records)
                .message(message)
                .endpoint(endpoint)
                .live(live)
                .build());
    }

    public Collection<IngestionStatus> getAllStatuses() {
        return healthMap.values();
    }

    public IngestionStatus getStatus(String source) {
        return healthMap.get(source);
    }
}
