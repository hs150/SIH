package com.sih.hazardrelocation.mapper;

import com.sih.hazardrelocation.entity.User;
import com.sih.hazardrelocation.dto.auth.LoginResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public LoginResponse toLoginResponse(User user, String token) {
        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}