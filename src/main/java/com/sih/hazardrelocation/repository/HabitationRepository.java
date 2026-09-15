package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.Habitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HabitationRepository extends JpaRepository<Habitation, UUID> {

    List<Habitation> findByDistrictIgnoreCase(String district);

    List<Habitation> findByStateIgnoreCase(String state);

    List<Habitation> findByDistrictIgnoreCaseAndStateIgnoreCase(
            String district,
            String state
    );

    List<Habitation> findByVulnerabilityScoreGreaterThanEqual(
            Double score
    );
}