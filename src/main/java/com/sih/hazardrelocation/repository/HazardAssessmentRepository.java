package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.HazardAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HazardAssessmentRepository
        extends JpaRepository<HazardAssessment, UUID> {

    List<HazardAssessment> findByHabitationIdOrderByAssessmentDateDesc(
            UUID habitationId
    );

    Optional<HazardAssessment> findTopByHabitationIdOrderByAssessmentDateDesc(UUID habitationId);

    List<HazardAssessment> findByHabitationId(UUID habitationId);

    Optional<HazardAssessment> findFirstByHabitationIdOrderByAssessmentDateDesc(
            UUID habitationId
    );

    List<HazardAssessment> findByOverallHazardScoreGreaterThanEqual(
            Double score
    );
}