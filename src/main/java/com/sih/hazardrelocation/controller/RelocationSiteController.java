package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.relocation.RelocationSiteRequest;
import com.sih.hazardrelocation.dto.relocation.RelocationSiteResponse;
import com.sih.hazardrelocation.service.RelocationSiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/relocation-sites")
public class RelocationSiteController {

    private final RelocationSiteService service;

    public RelocationSiteController(
            RelocationSiteService service
    ) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RelocationSiteResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<RelocationSiteResponse>>
    getActive() {

        return ResponseEntity.ok(
                service.getActiveSites()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelocationSiteResponse>
    getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<RelocationSiteResponse>
    create(
            @Valid @RequestBody RelocationSiteRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RelocationSiteResponse>
    update(
            @PathVariable UUID id,
            @Valid @RequestBody RelocationSiteRequest request
    ) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}