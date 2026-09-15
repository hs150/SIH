package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.assessment.HazardAssessmentResponse;
import com.sih.hazardrelocation.service.RiskAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    public AssessmentController(
            RiskAssessmentService riskAssessmentService
    ) {
        this.riskAssessmentService =
                riskAssessmentService;
    }

    @PostMapping("/hazard/{habitationId}")
    public ResponseEntity<HazardAssessmentResponse>
    calculateHazardRisk(
            @PathVariable UUID habitationId
    ) {

        return ResponseEntity.ok(
                riskAssessmentService.calculateRisk(
                        habitationId
                )
        );
    }

    @GetMapping("/hazard/{habitationId}")
    public ResponseEntity<HazardAssessmentResponse>
    getLatestAssessment(
            @PathVariable UUID habitationId
    ) {

        return ResponseEntity.ok(
                riskAssessmentService.getLatestAssessment(
                        habitationId
                )
        );
    }

    @GetMapping("/hazard/{habitationId}/history")
    public ResponseEntity<List<HazardAssessmentResponse>>
    getAssessmentHistory(
            @PathVariable UUID habitationId
    ) {

        return ResponseEntity.ok(
                riskAssessmentService.getAssessmentHistory(
                        habitationId
                )
        );
    }
}