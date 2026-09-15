package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.relocation.RelocationPriorityResponse;
import com.sih.hazardrelocation.service.PriorityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/priorities")
public class PriorityController {

    private final PriorityService priorityService;

    public PriorityController(
            PriorityService priorityService
    ) {
        this.priorityService = priorityService;
    }

    @PostMapping("/{habitationId}")
    public ResponseEntity<RelocationPriorityResponse>
    calculate(
            @PathVariable UUID habitationId
    ) {

        return ResponseEntity.ok(
                priorityService.calculate(
                        habitationId
                )
        );
    }

    @GetMapping("/{habitationId}")
    public ResponseEntity<RelocationPriorityResponse>
    getLatest(
            @PathVariable UUID habitationId
    ) {

        return ResponseEntity.ok(
                priorityService.getLatest(
                        habitationId
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<RelocationPriorityResponse>>
    getAll() {

        return ResponseEntity.ok(
                priorityService.getAllPriorities()
        );
    }
}