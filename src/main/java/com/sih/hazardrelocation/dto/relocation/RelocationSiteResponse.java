package com.sih.hazardrelocation.dto.relocation;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelocationSiteResponse {

    private UUID id;
    private String name;
    private String district;
    private String state;

    private Double availableArea;
    private Integer existingPopulation;

    private Double infrastructureScore;
    private Double accessibilityScore;
    private Double safetyScore;

    private Double latitude;
    private Double longitude;

    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}