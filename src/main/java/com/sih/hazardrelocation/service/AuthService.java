package com.sih.hazardrelocation.service;

import com.sih.hazardrelocation.entity.User;
import com.sih.hazardrelocation.repository.UserRepository;
import com.sih.hazardrelocation.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    public boolean verifyPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }

    public String generateToken(User user) {

        return jwtService.generateToken(user);
    }

    public String encodePassword(String password) {

        return passwordEncoder.encode(password);
    }

    public User save(User user) {

        return userRepository.save(user);
    }
}