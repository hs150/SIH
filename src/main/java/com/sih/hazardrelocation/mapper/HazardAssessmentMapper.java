package com.sih.hazardrelocation.mapper;

import com.sih.hazardrelocation.dto.assessment.HazardAssessmentResponse;
import com.sih.hazardrelocation.entity.HazardAssessment;
import org.springframework.stereotype.Component;

@Component
public class HazardAssessmentMapper {

    public HazardAssessmentResponse toResponse(HazardAssessment entity) {

        return HazardAssessmentResponse.builder()
                .id(entity.getId())
                .habitationId(entity.getHabitation().getId())
                .habitationName(entity.getHabitation().getName())
                .floodRisk(entity.getFloodRisk())
                .landslideRisk(entity.getLandslideRisk())
                .cloudburstRisk(entity.getCloudburstRisk())
                .erosionRisk(entity.getErosionRisk())
                .overallHazardScore(entity.getOverallHazardScore())
                .assessmentDate(entity.getAssessmentDate())
                .modelVersion(entity.getModelVersion())
                .build();
    }
}