package com.sih.hazardrelocation.mapper;

import com.sih.hazardrelocation.dto.habitation.HabitationRequest;
import com.sih.hazardrelocation.dto.habitation.HabitationResponse;
import com.sih.hazardrelocation.entity.Habitation;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

@Component
public class HabitationMapper {

    private final GeometryFactory geometryFactory = new GeometryFactory();

    public Habitation toEntity(HabitationRequest request) {

        Point point = null;

        if (request.getLatitude() != null && request.getLongitude() != null) {
            point = geometryFactory.createPoint(
                    new Coordinate(
                            request.getLongitude(),
                            request.getLatitude()
                    )
            );
            point.setSRID(4326);
        }

        return Habitation.builder()
                .name(request.getName())
                .district(request.getDistrict())
                .state(request.getState())
                .population(request.getPopulation())
                .households(request.getHouseholds())
                .vulnerabilityScore(request.getVulnerabilityScore())
                .geometry(point)
                .build();
    }

    public void updateEntity(Habitation entity, HabitationRequest request) {

        entity.setName(request.getName());
        entity.setDistrict(request.getDistrict());
        entity.setState(request.getState());
        entity.setPopulation(request.getPopulation());
        entity.setHouseholds(request.getHouseholds());
        entity.setVulnerabilityScore(request.getVulnerabilityScore());

        if (request.getLatitude() != null && request.getLongitude() != null) {

            Point point = geometryFactory.createPoint(
                    new Coordinate(
                            request.getLongitude(),
                            request.getLatitude()
                    )
            );

            point.setSRID(4326);
            entity.setGeometry(point);
        }
    }

    public HabitationResponse toResponse(Habitation entity) {

        Double latitude = null;
        Double longitude = null;

        if (entity.getGeometry() != null) {
            latitude = entity.getGeometry().getY();
            longitude = entity.getGeometry().getX();
        }

        return HabitationResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .district(entity.getDistrict())
                .state(entity.getState())
                .population(entity.getPopulation())
                .households(entity.getHouseholds())
                .vulnerabilityScore(entity.getVulnerabilityScore())
                .latitude(latitude)
                .longitude(longitude)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}