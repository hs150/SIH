package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "capacity_assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CapacityAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "relocation_site_id", nullable = false)
    private RelocationSite relocationSite;

    @Column(name = "available_area")
    private Double availableArea = 0.0;

    @Column(name = "existing_population")
    private Integer existingPopulation = 0;

    @Column(name = "estimated_capacity")
    private Integer estimatedCapacity = 0;

    @Column(name = "available_capacity")
    private Integer availableCapacity = 0;

    @Column(name = "infrastructure_capacity_score")
    private Double infrastructureCapacityScore = 0.0;

    @Column(name = "water_capacity_score")
    private Double waterCapacityScore = 0.0;

    @Column(name = "accessibility_score")
    private Double accessibilityScore = 0.0;

    @Column(name = "overall_capacity_score")
    private Double overallCapacityScore = 0.0;

    @Column(name = "assessment_date", nullable = false)
    private LocalDateTime assessmentDate;

    @PrePersist
    protected void onCreate() {
        assessmentDate = LocalDateTime.now();

        if (availableArea == null) availableArea = 0.0;
        if (existingPopulation == null) existingPopulation = 0;
        if (estimatedCapacity == null) estimatedCapacity = 0;
        if (availableCapacity == null) availableCapacity = 0;
        if (infrastructureCapacityScore == null) infrastructureCapacityScore = 0.0;
        if (waterCapacityScore == null) waterCapacityScore = 0.0;
        if (accessibilityScore == null) accessibilityScore = 0.0;
        if (overallCapacityScore == null) overallCapacityScore = 0.0;
    }
}