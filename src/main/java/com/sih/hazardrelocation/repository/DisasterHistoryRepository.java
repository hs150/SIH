package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.DisasterHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DisasterHistoryRepository
        extends JpaRepository<DisasterHistory, UUID> {

    List<DisasterHistory> findByHabitationId(UUID habitationId);

    List<DisasterHistory> findByHazardTypeIgnoreCase(
            String hazardType
    );

    long countByHabitationId(UUID habitationId);
}