package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.entity.RedZone;
import com.sih.hazardrelocation.service.RedZoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/red-zones")
public class RedZoneController {

    private final RedZoneService redZoneService;

    public RedZoneController(
            RedZoneService redZoneService
    ) {
        this.redZoneService = redZoneService;
    }

    @GetMapping
    public ResponseEntity<List<RedZone>> getAll() {

        return ResponseEntity.ok(
                redZoneService.getAll()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<RedZone>> getActive() {

        return ResponseEntity.ok(
                redZoneService.getActive()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RedZone> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                redZoneService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<RedZone> create(
            @RequestBody RedZone redZone
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        redZoneService.create(
                                redZone
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RedZone> update(
            @PathVariable UUID id,
            @RequestBody RedZone redZone
    ) {

        return ResponseEntity.ok(
                redZoneService.update(
                        id,
                        redZone
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        redZoneService.delete(id);

        return ResponseEntity.noContent().build();
    }
}