package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "habitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habitation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false)
    private Integer population = 0;

    @Column(nullable = false)
    private Integer households = 0;

    @Column(name = "vulnerability_score")
    private Double vulnerabilityScore = 0.0;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point geometry;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (population == null) {
            population = 0;
        }

        if (households == null) {
            households = 0;
        }

        if (vulnerabilityScore == null) {
            vulnerabilityScore = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}