package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.assessment.CapacityAssessmentResponse;
import com.sih.hazardrelocation.service.CapacityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/capacity")
public class CapacityController {

    private final CapacityService capacityService;

    public CapacityController(
            CapacityService capacityService
    ) {
        this.capacityService = capacityService;
    }

    @PostMapping("/{relocationSiteId}")
    public ResponseEntity<CapacityAssessmentResponse>
    calculate(
            @PathVariable UUID relocationSiteId
    ) {

        return ResponseEntity.ok(
                capacityService.calculate(
                        relocationSiteId
                )
        );
    }

    @GetMapping("/{relocationSiteId}")
    public ResponseEntity<CapacityAssessmentResponse>
    getLatest(
            @PathVariable UUID relocationSiteId
    ) {

        return ResponseEntity.ok(
                capacityService.getLatest(
                        relocationSiteId
                )
        );
    }
}