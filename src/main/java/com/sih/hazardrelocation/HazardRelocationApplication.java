package com.sih.hazardrelocation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HazardRelocationApplication {

    public static void main(String[] args) {
        SpringApplication.run(HazardRelocationApplication.class, args);
    }
}