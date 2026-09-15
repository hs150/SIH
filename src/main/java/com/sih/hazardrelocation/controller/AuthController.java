package com.sih.hazardrelocation.controller;

import com.sih.hazardrelocation.dto.auth.LoginRequest;
import com.sih.hazardrelocation.dto.auth.LoginResponse;
import com.sih.hazardrelocation.entity.User;
import com.sih.hazardrelocation.mapper.UserMapper;
import com.sih.hazardrelocation.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    public AuthController(
            AuthService authService,
            UserMapper userMapper
    ) {
        this.authService = authService;
        this.userMapper = userMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        User user =
                authService.findByEmail(request.getEmail());

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException(
                    "User account is inactive"
            );
        }

        if (!authService.verifyPassword(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token =
                authService.generateToken(user);

        return ResponseEntity.ok(
                userMapper.toLoginResponse(
                        user,
                        token
                )
        );
    }
}