package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.CapacityAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CapacityAssessmentRepository
        extends JpaRepository<CapacityAssessment, UUID> {

    List<CapacityAssessment> findByRelocationSiteIdOrderByAssessmentDateDesc(
            UUID relocationSiteId
    );

    Optional<CapacityAssessment>
    findFirstByRelocationSiteIdOrderByAssessmentDateDesc(
            UUID relocationSiteId
    );

    Optional<CapacityAssessment> findTopByRelocationSiteIdOrderByAssessmentDateDesc(UUID relocationSiteId);

    List<CapacityAssessment> findByOverallCapacityScoreGreaterThanEqual(
            Double score
    );
}