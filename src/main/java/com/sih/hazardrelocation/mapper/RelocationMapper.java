package com.sih.hazardrelocation.mapper;

import com.sih.hazardrelocation.dto.assessment.CapacityAssessmentResponse;
import com.sih.hazardrelocation.dto.relocation.RelocationPriorityResponse;
import com.sih.hazardrelocation.dto.relocation.RelocationSiteRequest;
import com.sih.hazardrelocation.dto.relocation.RelocationSiteResponse;
import com.sih.hazardrelocation.entity.CapacityAssessment;
import com.sih.hazardrelocation.entity.RelocationPriority;
import com.sih.hazardrelocation.entity.RelocationSite;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

@Component
public class RelocationMapper {

    private final GeometryFactory geometryFactory = new GeometryFactory();

    public RelocationSite toEntity(RelocationSiteRequest request) {

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

        return RelocationSite.builder()
                .name(request.getName())
                .district(request.getDistrict())
                .state(request.getState())
                .availableArea(request.getAvailableArea())
                .existingPopulation(request.getExistingPopulation())
                .infrastructureScore(request.getInfrastructureScore())
                .accessibilityScore(request.getAccessibilityScore())
                .safetyScore(request.getSafetyScore())
                .geometry(point)
                .active(true)
                .build();
    }

    public void updateEntity(
            RelocationSite entity,
            RelocationSiteRequest request
    ) {

        entity.setName(request.getName());
        entity.setDistrict(request.getDistrict());
        entity.setState(request.getState());
        entity.setAvailableArea(request.getAvailableArea());
        entity.setExistingPopulation(request.getExistingPopulation());
        entity.setInfrastructureScore(request.getInfrastructureScore());
        entity.setAccessibilityScore(request.getAccessibilityScore());
        entity.setSafetyScore(request.getSafetyScore());

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

    public RelocationSiteResponse toResponse(RelocationSite entity) {

        Double latitude = null;
        Double longitude = null;

        if (entity.getGeometry() != null) {
            latitude = entity.getGeometry().getY();
            longitude = entity.getGeometry().getX();
        }

        return RelocationSiteResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .district(entity.getDistrict())
                .state(entity.getState())
                .availableArea(entity.getAvailableArea())
                .existingPopulation(entity.getExistingPopulation())
                .infrastructureScore(entity.getInfrastructureScore())
                .accessibilityScore(entity.getAccessibilityScore())
                .safetyScore(entity.getSafetyScore())
                .latitude(latitude)
                .longitude(longitude)
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CapacityAssessmentResponse toCapacityResponse(
            CapacityAssessment entity
    ) {

        return CapacityAssessmentResponse.builder()
                .id(entity.getId())
                .relocationSiteId(entity.getRelocationSite().getId())
                .relocationSiteName(entity.getRelocationSite().getName())
                .availableArea(entity.getAvailableArea())
                .existingPopulation(entity.getExistingPopulation())
                .estimatedCapacity(entity.getEstimatedCapacity())
                .availableCapacity(entity.getAvailableCapacity())
                .infrastructureCapacityScore(
                        entity.getInfrastructureCapacityScore()
                )
                .waterCapacityScore(entity.getWaterCapacityScore())
                .accessibilityScore(entity.getAccessibilityScore())
                .overallCapacityScore(entity.getOverallCapacityScore())
                .assessmentDate(entity.getAssessmentDate())
                .build();
    }

    public RelocationPriorityResponse toPriorityResponse(
            RelocationPriority entity
    ) {

        return RelocationPriorityResponse.builder()
                .id(entity.getId())
                .habitationId(entity.getHabitation().getId())
                .habitationName(entity.getHabitation().getName())
                .hazardScore(entity.getHazardScore())
                .vulnerabilityScore(entity.getVulnerabilityScore())
                .historicalRiskScore(entity.getHistoricalRiskScore())
                .populationScore(entity.getPopulationScore())
                .overallPriorityScore(entity.getOverallPriorityScore())
                .priorityLevel(entity.getPriorityLevel())
                .recommendedTimeline(entity.getRecommendedTimeline())
                .recommendedSiteId(
                        entity.getRecommendedSite() != null
                                ? entity.getRecommendedSite().getId()
                                : null
                )
                .recommendedSiteName(
                        entity.getRecommendedSite() != null
                                ? entity.getRecommendedSite().getName()
                                : null
                )
                .calculatedAt(entity.getCalculatedAt())
                .build();
    }
}