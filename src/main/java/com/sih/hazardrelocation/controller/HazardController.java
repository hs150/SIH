package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.hazard.HazardEventRequest;
import com.sih.hazardrelocation.dto.hazard.HazardEventResponse;
import com.sih.hazardrelocation.service.HazardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hazards")
public class HazardController {

    private final HazardService hazardService;

    public HazardController(
            HazardService hazardService
    ) {
        this.hazardService = hazardService;
    }

    @GetMapping
    public ResponseEntity<List<HazardEventResponse>> getAll() {

        return ResponseEntity.ok(
                hazardService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HazardEventResponse> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                hazardService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<HazardEventResponse> create(
            @Valid @RequestBody HazardEventRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        hazardService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HazardEventResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody HazardEventRequest request
    ) {

        return ResponseEntity.ok(
                hazardService.update(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        hazardService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{hazardType}")
    public ResponseEntity<List<HazardEventResponse>>
    getByType(
            @PathVariable String hazardType
    ) {

        return ResponseEntity.ok(
                hazardService.getByType(
                        hazardType
                )
        );
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<HazardEventResponse>>
    getByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {

        return ResponseEntity.ok(
                hazardService.getByDateRange(
                        start,
                        end
                )
        );
    }

    @GetMapping("/severe")
    public ResponseEntity<List<HazardEventResponse>>
    getSevereHazards(
            @RequestParam(
                    defaultValue = "70"
            )
            Double minimumSeverity
    ) {

        return ResponseEntity.ok(
                hazardService.getSevereHazards(
                        minimumSeverity
                )
        );
    }
}