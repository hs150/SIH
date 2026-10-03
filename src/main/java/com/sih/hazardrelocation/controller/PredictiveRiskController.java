package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.service.PredictiveRiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/predictive")
public class PredictiveRiskController {

    private final PredictiveRiskService predictiveRiskService;

    public PredictiveRiskController(PredictiveRiskService predictiveRiskService) {
        this.predictiveRiskService = predictiveRiskService;
    }

    @GetMapping("/assessments")
    public ResponseEntity<List<Map<String, Object>>> getAllAssessments() {
        return ResponseEntity.ok(predictiveRiskService.assessAllHabitations());
    }

    @GetMapping("/assessment/{habitationId}")
    public ResponseEntity<Map<String, Object>> getHabitationAssessment(@PathVariable UUID habitationId) {
        return ResponseEntity.ok(predictiveRiskService.assessHabitationSusceptibility(habitationId));
    }
}
