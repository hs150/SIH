package com.sih.hazardrelocation.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> adminTest() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Admin access granted"
                )
        );
    }

    @GetMapping("/authority-test")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'AUTHORITY')"
    )
    public ResponseEntity<Map<String, String>>
    authorityTest() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Authority access granted"
                )
        );
    }

    @GetMapping("/analyst-test")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'AUTHORITY', 'ANALYST')"
    )
    public ResponseEntity<Map<String, String>>
    analystTest() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Authenticated user access granted"
                )
        );
    }
}