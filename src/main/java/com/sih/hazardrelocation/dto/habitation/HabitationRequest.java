package com.sih.hazardrelocation.dto.habitation;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HabitationRequest {

    @NotBlank(message = "Habitation name is required")
    @Size(max = 200)
    private String name;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotNull(message = "Population is required")
    @Min(value = 0, message = "Population cannot be negative")
    private Integer population;

    @NotNull(message = "Households is required")
    @Min(value = 0, message = "Households cannot be negative")
    private Integer households;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double vulnerabilityScore;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;
}