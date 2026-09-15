package com.sih.hazardrelocation.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hazardRelocationOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title(
                                        "Hazard Relocation API"
                                )
                                .description(
                                        "REST API for intelligent "
                                        + "hazard identification, "
                                        + "red-zone assessment, "
                                        + "carrying-capacity "
                                        + "assessment and "
                                        + "relocation prioritization."
                                )
                                .version("1.0.0")
                                .contact(
                                        new Contact()
                                                .name(
                                                        "SIH Hazard "
                                                        + "Relocation Team"
                                                )
                                )
                )
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "bearerAuth",
                                        new SecurityScheme()
                                                .type(
                                                        SecurityScheme
                                                                .Type
                                                                .HTTP
                                                )
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}