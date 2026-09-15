package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "hazard_assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HazardAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habitation_id", nullable = false)
    private Habitation habitation;

    @Column(name = "flood_risk")
    private Double floodRisk = 0.0;

    @Column(name = "landslide_risk")
    private Double landslideRisk = 0.0;

    @Column(name = "cloudburst_risk")
    private Double cloudburstRisk = 0.0;

    @Column(name = "erosion_risk")
    private Double erosionRisk = 0.0;

    @Column(name = "overall_hazard_score")
    private Double overallHazardScore = 0.0;

    @Column(name = "assessment_date", nullable = false)
    private LocalDateTime assessmentDate;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @PrePersist
    protected void onCreate() {
        assessmentDate = LocalDateTime.now();

        if (floodRisk == null) floodRisk = 0.0;
        if (landslideRisk == null) landslideRisk = 0.0;
        if (cloudburstRisk == null) cloudburstRisk = 0.0;
        if (erosionRisk == null) erosionRisk = 0.0;
        if (overallHazardScore == null) overallHazardScore = 0.0;
    }
}