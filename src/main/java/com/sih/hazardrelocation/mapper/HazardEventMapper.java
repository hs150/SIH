package com.sih.hazardrelocation.mapper;

import com.sih.hazardrelocation.dto.hazard.HazardEventRequest;
import com.sih.hazardrelocation.dto.hazard.HazardEventResponse;
import com.sih.hazardrelocation.entity.HazardEvent;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

@Component
public class HazardEventMapper {

    private final GeometryFactory geometryFactory = new GeometryFactory();

    public HazardEvent toEntity(HazardEventRequest request) {

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

        return HazardEvent.builder()
                .hazardType(request.getHazardType())
                .severity(request.getSeverity())
                .eventDate(request.getEventDate())
                .source(request.getSource())
                .description(request.getDescription())
                .geometry(point)
                .build();
    }

    public HazardEventResponse toResponse(HazardEvent entity) {

        Double latitude = null;
        Double longitude = null;

        if (entity.getGeometry() instanceof Point point) {
            latitude = point.getY();
            longitude = point.getX();
        }

        return HazardEventResponse.builder()
                .id(entity.getId())
                .hazardType(entity.getHazardType())
                .severity(entity.getSeverity())
                .eventDate(entity.getEventDate())
                .source(entity.getSource())
                .description(entity.getDescription())
                .latitude(latitude)
                .longitude(longitude)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}