package com.sih.hazardrelocation.dto.hazard;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HazardEventResponse {

    private UUID id;
    private String hazardType;
    private Double severity;
    private LocalDate eventDate;
    private String source;
    private String description;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}