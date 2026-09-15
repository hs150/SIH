package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.RelocationSite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RelocationSiteRepository
        extends JpaRepository<RelocationSite, UUID> {

    List<RelocationSite> findByDistrictIgnoreCase(
            String district
    );

    List<RelocationSite> findByStateIgnoreCase(
            String state
    );

    List<RelocationSite> findByActiveTrue();

    List<RelocationSite> findBySafetyScoreGreaterThanEqual(
            Double score
    );

    List<RelocationSite> findByAccessibilityScoreGreaterThanEqual(
            Double score
    );
}