package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.habitation.HabitationRequest;
import com.sih.hazardrelocation.dto.habitation.HabitationResponse;
import com.sih.hazardrelocation.service.HabitationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habitations")
public class HabitationController {

    private final HabitationService habitationService;

    public HabitationController(
            HabitationService habitationService
    ) {
        this.habitationService = habitationService;
    }

    @GetMapping
    public ResponseEntity<List<HabitationResponse>> getAll() {

        return ResponseEntity.ok(
                habitationService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitationResponse> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                habitationService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<HabitationResponse> create(
            @Valid @RequestBody HabitationRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        habitationService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitationResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody HabitationRequest request
    ) {

        return ResponseEntity.ok(
                habitationService.update(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        habitationService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<HabitationResponse>>
    getByDistrict(
            @PathVariable String district
    ) {

        return ResponseEntity.ok(
                habitationService.getByDistrict(
                        district
                )
        );
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<HabitationResponse>>
    getByState(
            @PathVariable String state
    ) {

        return ResponseEntity.ok(
                habitationService.getByState(state)
        );
    }

    @GetMapping("/vulnerable")
    public ResponseEntity<List<HabitationResponse>>
    getHighlyVulnerable(
            @RequestParam(
                    defaultValue = "70"
            )
            Double minimumScore
    ) {

        return ResponseEntity.ok(
                habitationService.getHighlyVulnerable(
                        minimumScore
                )
        );
    }
}