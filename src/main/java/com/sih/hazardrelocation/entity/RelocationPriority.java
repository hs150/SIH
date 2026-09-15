package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "relocation_priorities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelocationPriority {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habitation_id", nullable = false)
    private Habitation habitation;

    @Column(name = "hazard_score")
    private Double hazardScore = 0.0;

    @Column(name = "vulnerability_score")
    private Double vulnerabilityScore = 0.0;

    @Column(name = "historical_risk_score")
    private Double historicalRiskScore = 0.0;

    @Column(name = "population_score")
    private Double populationScore = 0.0;

    @Column(name = "overall_priority_score")
    private Double overallPriorityScore = 0.0;

    @Column(name = "priority_level", nullable = false, length = 30)
    private String priorityLevel;

    @Column(name = "recommended_timeline", length = 30)
    private String recommendedTimeline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommended_site_id")
    private RelocationSite recommendedSite;

    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = LocalDateTime.now();

        if (hazardScore == null) hazardScore = 0.0;
        if (vulnerabilityScore == null) vulnerabilityScore = 0.0;
        if (historicalRiskScore == null) historicalRiskScore = 0.0;
        if (populationScore == null) populationScore = 0.0;
        if (overallPriorityScore == null) overallPriorityScore = 0.0;
    }
}