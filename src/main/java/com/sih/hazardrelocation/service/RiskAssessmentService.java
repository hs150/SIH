package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.assessment.HazardAssessmentResponse;
import com.sih.hazardrelocation.entity.DisasterHistory;
import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.entity.HazardAssessment;
import com.sih.hazardrelocation.mapper.HazardAssessmentMapper;
import com.sih.hazardrelocation.repository.DisasterHistoryRepository;
import com.sih.hazardrelocation.repository.HabitationRepository;
import com.sih.hazardrelocation.repository.HazardAssessmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RiskAssessmentService {

    private final HabitationRepository habitationRepository;
    private final HazardAssessmentRepository assessmentRepository;
    private final DisasterHistoryRepository historyRepository;
    private final HazardAssessmentMapper assessmentMapper;

    public RiskAssessmentService(
            HabitationRepository habitationRepository,
            HazardAssessmentRepository assessmentRepository,
            DisasterHistoryRepository historyRepository,
            HazardAssessmentMapper assessmentMapper
    ) {
        this.habitationRepository = habitationRepository;
        this.assessmentRepository = assessmentRepository;
        this.historyRepository = historyRepository;
        this.assessmentMapper = assessmentMapper;
    }

    @Transactional(readOnly = true)
    public HazardAssessmentResponse getLatestAssessment(
            UUID habitationId
    ) {

        HazardAssessment assessment =
                assessmentRepository
                        .findTopByHabitationIdOrderByAssessmentDateDesc(
                                habitationId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No risk assessment found for habitation: "
                                                + habitationId
                                )
                        );

        return assessmentMapper.toResponse(assessment);
    }

    @Transactional(readOnly = true)
    public List<HazardAssessmentResponse> getAssessmentHistory(
            UUID habitationId
    ) {

        return assessmentRepository
                .findByHabitationId(habitationId)
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }

    public HazardAssessmentResponse calculateRisk(
            UUID habitationId
    ) {

        Habitation habitation =
                habitationRepository.findById(habitationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Habitation not found: "
                                                + habitationId
                                )
                        );

        List<DisasterHistory> history =
                historyRepository.findByHabitationId(habitationId);

        double historicalRisk =
                calculateHistoricalRisk(history);

        double vulnerability =
                normalize(
                        habitation.getVulnerabilityScore()
                );

        /*
         * MVP hazard estimation.
         *
         * In the next stage this can be replaced with
         * actual GIS/hazard-model data.
         */
        double floodRisk = calculateHazardTypeRisk(
                history,
                "FLOOD"
        );

        double landslideRisk = calculateHazardTypeRisk(
                history,
                "LANDSLIDE"
        );

        double cloudburstRisk = calculateHazardTypeRisk(
                history,
                "CLOUDBURST"
        );

        double erosionRisk = calculateHazardTypeRisk(
                history,
                "EROSION"
        );

        double hazardScore =
                Math.max(
                        Math.max(floodRisk, landslideRisk),
                        Math.max(cloudburstRisk, erosionRisk)
                );

        double overallScore =
                (hazardScore * 0.50)
                        + (vulnerability * 0.30)
                        + (historicalRisk * 0.20);

        HazardAssessment assessment =
                HazardAssessment.builder()
                        .habitation(habitation)
                        .floodRisk(floodRisk)
                        .landslideRisk(landslideRisk)
                        .cloudburstRisk(cloudburstRisk)
                        .erosionRisk(erosionRisk)
                        .overallHazardScore(
                                roundScore(overallScore)
                        )
                        .modelVersion("MVP-1.0")
                        .build();

        HazardAssessment saved =
                assessmentRepository.save(assessment);

        return assessmentMapper.toResponse(saved);
    }

    private double calculateHistoricalRisk(
            List<DisasterHistory> history
    ) {

        if (history == null || history.isEmpty()) {
            return 0.0;
        }

        double totalSeverity = history.stream()
                .mapToDouble(item ->
                        item.getSeverity() != null
                                ? item.getSeverity()
                                : 0.0
                )
                .sum();

        double averageSeverity =
                totalSeverity / history.size();

        double deathsFactor =
                Math.min(
                        history.stream()
                                .mapToInt(item ->
                                        item.getDeaths() != null
                                                ? item.getDeaths()
                                                : 0
                                )
                                .sum() * 5.0,
                        100.0
                );

        return roundScore(
                Math.min(
                        (averageSeverity * 0.70)
                                + (deathsFactor * 0.30),
                        100.0
                )
        );
    }

    private double calculateHazardTypeRisk(
            List<DisasterHistory> history,
            String hazardType
    ) {

        return roundScore(
                history.stream()
                        .filter(item ->
                                item.getHazardType() != null
                                        && item.getHazardType()
                                        .equalsIgnoreCase(hazardType)
                        )
                        .mapToDouble(item ->
                                item.getSeverity() != null
                                        ? item.getSeverity()
                                        : 0.0
                        )
                        .max()
                        .orElse(0.0)
        );
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

    private double roundScore(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}