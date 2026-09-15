package com.sih.hazardrelocation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "disaster_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisasterHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habitation_id", nullable = false)
    private Habitation habitation;

    @Column(name = "hazard_type", nullable = false, length = 50)
    private String hazardType;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private Double severity = 0.0;

    @Column(name = "affected_population")
    private Integer affectedPopulation = 0;

    @Column(nullable = false)
    private Integer deaths = 0;

    @Column(name = "property_loss")
    private Double propertyLoss = 0.0;

    @Column(length = 255)
    private String source;

    @PrePersist
    protected void onCreate() {
        if (severity == null) {
            severity = 0.0;
        }

        if (affectedPopulation == null) {
            affectedPopulation = 0;
        }

        if (deaths == null) {
            deaths = 0;
        }

        if (propertyLoss == null) {
            propertyLoss = 0.0;
        }
    }
}