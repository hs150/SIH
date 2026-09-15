package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.RelocationPriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RelocationPriorityRepository
        extends JpaRepository<RelocationPriority, UUID> {

    List<RelocationPriority> findByPriorityLevelIgnoreCase(
            String priorityLevel
    );

    List<RelocationPriority> findByPriorityLevelIgnoreCaseOrderByOverallPriorityScoreDesc(
            String priorityLevel
    );

    List<RelocationPriority> findAllByOrderByOverallPriorityScoreDesc();

    Optional<RelocationPriority>
    findFirstByHabitationIdOrderByCalculatedAtDesc(
            UUID habitationId
    );

    Optional<RelocationPriority> findTopByHabitationIdOrderByCalculatedAtDesc(UUID habitationId);

    List<RelocationPriority>
    findByOverallPriorityScoreGreaterThanEqualOrderByOverallPriorityScoreDesc(
            Double score
    );
}