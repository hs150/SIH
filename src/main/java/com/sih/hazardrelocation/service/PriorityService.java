package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.dto.relocation.RelocationPriorityResponse;
import com.sih.hazardrelocation.entity.DisasterHistory;
import com.sih.hazardrelocation.entity.Habitation;
import com.sih.hazardrelocation.entity.HazardAssessment;
import com.sih.hazardrelocation.entity.RelocationPriority;
import com.sih.hazardrelocation.mapper.RelocationMapper;
import com.sih.hazardrelocation.repository.DisasterHistoryRepository;
import com.sih.hazardrelocation.repository.HabitationRepository;
import com.sih.hazardrelocation.repository.HazardAssessmentRepository;
import com.sih.hazardrelocation.repository.RelocationPriorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PriorityService {

    private final HabitationRepository habitationRepository;
    private final HazardAssessmentRepository hazardRepository;
    private final DisasterHistoryRepository historyRepository;
    private final RelocationPriorityRepository priorityRepository;
    private final RelocationMapper mapper;

    public PriorityService(
            HabitationRepository habitationRepository,
            HazardAssessmentRepository hazardRepository,
            DisasterHistoryRepository historyRepository,
            RelocationPriorityRepository priorityRepository,
            RelocationMapper mapper
    ) {
        this.habitationRepository = habitationRepository;
        this.hazardRepository = hazardRepository;
        this.historyRepository = historyRepository;
        this.priorityRepository = priorityRepository;
        this.mapper = mapper;
    }

    public RelocationPriorityResponse calculate(
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

        HazardAssessment assessment =
                hazardRepository
                        .findTopByHabitationIdOrderByAssessmentDateDesc(
                                habitationId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Risk assessment required before "
                                                + "priority calculation"
                                )
                        );

        List<DisasterHistory> history =
                historyRepository.findByHabitationId(
                        habitationId
                );

        double hazardScore =
                normalize(
                        assessment.getOverallHazardScore()
                );

        double vulnerabilityScore =
                normalize(
                        habitation.getVulnerabilityScore()
                );

        double historicalScore =
                calculateHistoricalScore(history);

        double populationScore =
                calculatePopulationScore(
                        habitation.getPopulation()
                );

        double overallScore =
                (hazardScore * 0.40)
                        + (vulnerabilityScore * 0.25)
                        + (historicalScore * 0.20)
                        + (populationScore * 0.15);

        String priorityLevel =
                determinePriority(overallScore);

        String timeline =
                determineTimeline(priorityLevel);

        RelocationPriority priority =
                RelocationPriority.builder()
                        .habitation(habitation)
                        .hazardScore(round(hazardScore))
                        .vulnerabilityScore(
                                round(vulnerabilityScore)
                        )
                        .historicalRiskScore(
                                round(historicalScore)
                        )
                        .populationScore(
                                round(populationScore)
                        )
                        .overallPriorityScore(
                                round(overallScore)
                        )
                        .priorityLevel(priorityLevel)
                        .recommendedTimeline(timeline)
                        .build();

        RelocationPriority saved =
                priorityRepository.save(priority);

        return mapper.toPriorityResponse(saved);
    }

    @Transactional(readOnly = true)
    public RelocationPriorityResponse getLatest(
            UUID habitationId
    ) {

        RelocationPriority priority =
                priorityRepository
                        .findTopByHabitationIdOrderByCalculatedAtDesc(
                                habitationId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No relocation priority found"
                                )
                        );

        return mapper.toPriorityResponse(priority);
    }

    @Transactional(readOnly = true)
    public List<RelocationPriorityResponse> getAllPriorities() {

        return priorityRepository
                .findAllByOrderByOverallPriorityScoreDesc()
                .stream()
                .map(mapper::toPriorityResponse)
                .toList();
    }

    private double calculateHistoricalScore(
            List<DisasterHistory> history
    ) {

        if (history == null || history.isEmpty()) {
            return 0.0;
        }

        double severity =
                history.stream()
                        .mapToDouble(item ->
                                item.getSeverity() != null
                                        ? item.getSeverity()
                                        : 0.0
                        )
                        .average()
                        .orElse(0.0);

        double deaths =
                history.stream()
                        .mapToInt(item ->
                                item.getDeaths() != null
                                        ? item.getDeaths()
                                        : 0
                        )
                        .sum();

        double deathScore =
                Math.min(deaths * 10.0, 100.0);

        return round(
                (severity * 0.70)
                        + (deathScore * 0.30)
        );
    }

    private double calculatePopulationScore(
            Integer population
    ) {

        if (population == null || population <= 0) {
            return 0.0;
        }

        /*
         * MVP normalization:
         * 5000+ population = 100.
         */
        return Math.min(
                population / 5000.0 * 100.0,
                100.0
        );
    }

    private String determinePriority(
            double score
    ) {

        if (score >= 80) {
            return "CRITICAL";
        }

        if (score >= 60) {
            return "HIGH";
        }

        if (score >= 40) {
            return "MEDIUM";
        }

        return "LOW";
    }

    private String determineTimeline(
            String priority
    ) {

        return switch (priority) {

            case "CRITICAL" -> "IMMEDIATE";

            case "HIGH" -> "SHORT_TERM";

            case "MEDIUM" -> "MEDIUM_TERM";

            default -> "MEDIUM_TERM";
        };
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