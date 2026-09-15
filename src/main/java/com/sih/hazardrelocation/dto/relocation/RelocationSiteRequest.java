package com.sih.hazardrelocation.dto.relocation;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RelocationSiteRequest {

    @NotBlank(message = "Site name is required")
    @Size(max = 200)
    private String name;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotNull(message = "Available area is required")
    @DecimalMin(value = "0.0")
    private Double availableArea;

    @Min(value = 0)
    private Integer existingPopulation;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double infrastructureScore;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double accessibilityScore;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double safetyScore;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;
}