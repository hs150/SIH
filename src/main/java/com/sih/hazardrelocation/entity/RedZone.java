package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.MultiPolygon;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "red_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "risk_level", nullable = false, length = 30)
    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(length = 255)
    private String source;

    @Column(columnDefinition = "geometry(MultiPolygon,4326)")
    private MultiPolygon geometry;

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

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}