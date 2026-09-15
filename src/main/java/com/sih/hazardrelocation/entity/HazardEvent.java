package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Geometry;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "hazard_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HazardEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "hazard_type", nullable = false, length = 50)
    private String hazardType;

    @Column(nullable = false)
    private Double severity = 0.0;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(length = 255)
    private String source;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "geometry(Geometry,4326)")
    private Geometry geometry;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (severity == null) {
            severity = 0.0;
        }
    }
}