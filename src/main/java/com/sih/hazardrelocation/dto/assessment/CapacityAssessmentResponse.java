package com.sih.hazardrelocation.dto.assessment;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CapacityAssessmentResponse {

    private UUID id;
    private UUID relocationSiteId;
    private String relocationSiteName;

    private Double availableArea;
    private Integer existingPopulation;
    private Integer estimatedCapacity;
    private Integer availableCapacity;

    private Double infrastructureCapacityScore;
    private Double waterCapacityScore;
    private Double accessibilityScore;
    private Double overallCapacityScore;

    private LocalDateTime assessmentDate;
}