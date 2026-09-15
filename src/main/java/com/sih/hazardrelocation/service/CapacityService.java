package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.assessment.CapacityAssessmentResponse;
import com.sih.hazardrelocation.entity.CapacityAssessment;
import com.sih.hazardrelocation.entity.RelocationSite;
import com.sih.hazardrelocation.mapper.RelocationMapper;
import com.sih.hazardrelocation.repository.CapacityAssessmentRepository;
import com.sih.hazardrelocation.repository.RelocationSiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CapacityService {

    private final CapacityAssessmentRepository assessmentRepository;
    private final RelocationSiteRepository siteRepository;
    private final RelocationMapper mapper;

    public CapacityService(
            CapacityAssessmentRepository assessmentRepository,
            RelocationSiteRepository siteRepository,
            RelocationMapper mapper
    ) {
        this.assessmentRepository = assessmentRepository;
        this.siteRepository = siteRepository;
        this.mapper = mapper;
    }

    public CapacityAssessmentResponse calculate(
            UUID relocationSiteId
    ) {

        RelocationSite site =
                siteRepository.findById(relocationSiteId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relocation site not found: "
                                                + relocationSiteId
                                )
                        );

        /*
         * MVP assumption:
         * Approximately 100 square units of area
         * are required per person.
         *
         * This value should later be replaced by
         * an official planning standard/dataset.
         */
        int estimatedCapacity =
                (int) Math.max(
                        0,
                        Math.floor(
                                site.getAvailableArea() != null
                                        ? site.getAvailableArea() / 100.0
                                        : 0
                        )
                );

        int existingPopulation =
                site.getExistingPopulation() != null
                        ? site.getExistingPopulation()
                        : 0;

        int availableCapacity =
                Math.max(
                        0,
                        estimatedCapacity - existingPopulation
                );

        double infrastructure =
                normalize(site.getInfrastructureScore());

        double accessibility =
                normalize(site.getAccessibilityScore());

        double safety =
                normalize(site.getSafetyScore());

        /*
         * Water capacity is not yet a field in
         * RelocationSite, so MVP uses infrastructure
         * as a proxy.
         */
        double waterCapacity = infrastructure;

        double overallScore =
                (infrastructure * 0.30)
                        + (waterCapacity * 0.20)
                        + (accessibility * 0.20)
                        + (safety * 0.30);

        CapacityAssessment assessment =
                CapacityAssessment.builder()
                        .relocationSite(site)
                        .availableArea(site.getAvailableArea())
                        .existingPopulation(existingPopulation)
                        .estimatedCapacity(estimatedCapacity)
                        .availableCapacity(availableCapacity)
                        .infrastructureCapacityScore(
                                round(infrastructure)
                        )
                        .waterCapacityScore(
                                round(waterCapacity)
                        )
                        .accessibilityScore(
                                round(accessibility)
                        )
                        .overallCapacityScore(
                                round(overallScore)
                        )
                        .build();

        CapacityAssessment saved =
                assessmentRepository.save(assessment);

        return mapper.toCapacityResponse(saved);
    }

    @Transactional(readOnly = true)
    public CapacityAssessmentResponse getLatest(
            UUID relocationSiteId
    ) {

        CapacityAssessment assessment =
                assessmentRepository
                        .findTopByRelocationSiteIdOrderByAssessmentDateDesc(
                                relocationSiteId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No capacity assessment found"
                                )
                        );

        return mapper.toCapacityResponse(assessment);
    }

    private double normalize(Double value) {

        if (value == null) {
            return 0.0;
        }

        return Math.max(
                0.0,
                Math.min(100.0, value)
        );
    }

    private double round(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}