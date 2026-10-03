package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.service.AllocationOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/allocation")
public class AllocationController {

    private final AllocationOptimizationService allocationService;

    public AllocationController(AllocationOptimizationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<Map<String, Object>> runOptimization(
            @RequestParam(defaultValue = "0.6") double communitySplitWeight,
            @RequestParam(defaultValue = "0.4") double distanceWeight
    ) {
        return ResponseEntity.ok(allocationService.optimizeAllocation(communitySplitWeight, distanceWeight));
    }
}
