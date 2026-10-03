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

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("hazardType")
    private String hazardType;

    public String getHazardType() {
        return hazardType != null ? hazardType : "MULTI_HAZARD";
    }

    public void setHazardType(String hazardType) {
        this.hazardType = hazardType;
    }

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(length = 255)
    private String source;

    @Column(name = "external_id", length = 255)
    private String externalId;

    @Column(name = "fetched_at")
    private java.time.LocalDateTime fetchedAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(columnDefinition = "geometry(MultiPolygon,4326)")
    private MultiPolygon geometry;

    @com.fasterxml.jackson.annotation.JsonProperty("coordinates")
    public java.util.List<java.util.List<java.util.List<java.util.List<Double>>>> getCoordinates() {
        if (geometry == null) {
            return null;
        }
        // GeoJSON MultiPolygon: [ polygon [ ring [ coord [lng, lat] ] ] ]
        java.util.List<java.util.List<java.util.List<java.util.List<Double>>>> multiPoly = new java.util.ArrayList<>();
        for (int i = 0; i < geometry.getNumGeometries(); i++) {
            if (geometry.getGeometryN(i) instanceof org.locationtech.jts.geom.Polygon polygon) {
                java.util.List<java.util.List<java.util.List<Double>>> polyRings = new java.util.ArrayList<>();

                // Exterior ring
                java.util.List<java.util.List<Double>> exteriorRing = new java.util.ArrayList<>();
                for (org.locationtech.jts.geom.Coordinate c : polygon.getExteriorRing().getCoordinates()) {
                    exteriorRing.add(java.util.List.of(c.getX(), c.getY()));
                }
                polyRings.add(exteriorRing);

                // Interior rings (holes)
                for (int h = 0; h < polygon.getNumInteriorRing(); h++) {
                    java.util.List<java.util.List<Double>> hole = new java.util.ArrayList<>();
                    for (org.locationtech.jts.geom.Coordinate c : polygon.getInteriorRingN(h).getCoordinates()) {
                        hole.add(java.util.List.of(c.getX(), c.getY()));
                    }
                    polyRings.add(hole);
                }

                multiPoly.add(polyRings);
            }
        }
        return multiPoly;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("wkt")
    public void setWkt(String wkt) {
        if (wkt != null && !wkt.trim().isEmpty()) {
            try {
                org.locationtech.jts.io.WKTReader reader = new org.locationtech.jts.io.WKTReader();
                org.locationtech.jts.geom.Geometry geom = reader.read(wkt);
                geom.setSRID(4326);
                if (geom instanceof org.locationtech.jts.geom.MultiPolygon mp) {
                    this.geometry = mp;
                } else if (geom instanceof org.locationtech.jts.geom.Polygon p) {
                    org.locationtech.jts.geom.GeometryFactory gf = new org.locationtech.jts.geom.GeometryFactory();
                    this.geometry = gf.createMultiPolygon(new org.locationtech.jts.geom.Polygon[]{p});
                    this.geometry.setSRID(4326);
                }
            } catch (Exception e) {
                // fallback
            }
        }
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

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}