package com.sih.hazardrelocation.dto.relocation;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelocationPriorityResponse {

    private UUID id;

    private UUID habitationId;
    private String habitationName;

    private Double hazardScore;
    private Double vulnerabilityScore;
    private Double historicalRiskScore;
    private Double populationScore;

    private Double overallPriorityScore;

    private String priorityLevel;
    private String recommendedTimeline;

    private UUID recommendedSiteId;
    private String recommendedSiteName;

    private LocalDateTime calculatedAt;
}