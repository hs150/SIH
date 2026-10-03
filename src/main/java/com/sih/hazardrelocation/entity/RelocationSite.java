package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "relocation_sites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelocationSite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "available_area")
    private Double availableArea = 0.0;

    @Column(name = "existing_population")
    private Integer existingPopulation = 0;

    @Column(name = "infrastructure_score")
    private Double infrastructureScore = 0.0;

    @Column(name = "accessibility_score")
    private Double accessibilityScore = 0.0;

    @Column(name = "safety_score")
    private Double safetyScore = 0.0;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point geometry;

    @com.fasterxml.jackson.annotation.JsonProperty("maxCapacity")
    public Integer getMaxCapacity() {
        if (availableArea != null && availableArea > 0) {
            return (int) (availableArea * 15.0);
        }
        return 1200;
    }

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (availableArea == null) availableArea = 0.0;
        if (existingPopulation == null) existingPopulation = 0;
        if (infrastructureScore == null) infrastructureScore = 0.0;
        if (accessibilityScore == null) accessibilityScore = 0.0;
        if (safetyScore == null) safetyScore = 0.0;
        if (active == null) active = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}