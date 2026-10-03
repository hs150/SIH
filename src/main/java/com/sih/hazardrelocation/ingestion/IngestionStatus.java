package com.sih.hazardrelocation.ingestion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngestionStatus {
    private String source;
    private String status; // SUCCESS, STANDBY, FAILED, WARNING
    private LocalDateTime lastSyncTime;
    private int recordsIngested;
    private String message;
    private String endpoint;
    private boolean live;
}
