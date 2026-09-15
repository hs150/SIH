package com.sih.hazardrelocation.dto.assessment;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HazardAssessmentResponse {

    private UUID id;
    private UUID habitationId;
    private String habitationName;

    private Double floodRisk;
    private Double landslideRisk;
    private Double cloudburstRisk;
    private Double erosionRisk;

    private Double overallHazardScore;

    private LocalDateTime assessmentDate;
    private String modelVersion;
}