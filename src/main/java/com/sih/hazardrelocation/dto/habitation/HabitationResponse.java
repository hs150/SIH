package com.sih.hazardrelocation.dto.habitation;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitationResponse {

    private UUID id;
    private String name;
    private String district;
    private String state;
    private Integer population;
    private Integer households;
    private Double vulnerabilityScore;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}