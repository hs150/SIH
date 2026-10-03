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

    @Column(name = "external_id", length = 255)
    private String externalId;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;

    @Column(columnDefinition = "geometry(Geometry,4326)")
    private Geometry geometry;

    @com.fasterxml.jackson.annotation.JsonProperty("lat")
    public Double getLatitude() {
        if (geometry != null && geometry.getCoordinate() != null) {
            return geometry.getCoordinate().getY();
        }
        return null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("lng")
    public Double getLongitude() {
        if (geometry != null && geometry.getCoordinate() != null) {
            return geometry.getCoordinate().getX();
        }
        return null;
    }

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