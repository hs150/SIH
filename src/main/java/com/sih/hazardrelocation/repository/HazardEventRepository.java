package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.HazardEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface HazardEventRepository extends JpaRepository<HazardEvent, UUID> {

    List<HazardEvent> findByHazardTypeIgnoreCase(String hazardType);

    List<HazardEvent> findByEventDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    List<HazardEvent> findBySeverityGreaterThanEqual(
            Double severity
    );
}