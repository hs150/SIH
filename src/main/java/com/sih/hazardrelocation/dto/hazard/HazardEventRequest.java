package com.sih.hazardrelocation.dto.hazard;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HazardEventRequest {

    @NotBlank(message = "Hazard type is required")
    @Size(max = 50)
    private String hazardType;

    @NotNull(message = "Severity is required")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double severity;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    @Size(max = 255)
    private String source;

    private String description;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;
}