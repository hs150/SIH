package com.sih.hazardrelocation.dto.auth;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String tokenType;
    private UUID userId;
    private String name;
    private String email;
    private String role;
}