package com.sih.hazardrelocation.repository;

import com.sih.hazardrelocation.entity.RedZone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RedZoneRepository extends JpaRepository<RedZone, UUID> {

    List<RedZone> findByActiveTrue();

    List<RedZone> findByRiskLevelIgnoreCase(String riskLevel);

    List<RedZone> findByRiskLevelIgnoreCaseAndActiveTrue(String riskLevel);

    java.util.Optional<RedZone> findByExternalId(String externalId);
}