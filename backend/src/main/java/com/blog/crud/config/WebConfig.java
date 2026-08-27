package com.blog.crud.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/api/usuarios/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")

                .allowedOriginPatterns(
                        // Local
                        "http://localhost:8081",
                        "https://localhost:8081",
                        "http://127.0.0.1:8081",
                        "https://127.0.0.1:8081",

                        // Redes privadas
                        "http://192.168.*.*:8081",
                        "https://192.168.*.*:8081",
                        "http://10.*.*.*:8081",
                        "https://10.*.*.*:8081",
                        "http://172.*.*.*:8081",
                        "https://172.*.*.*:8081",

                        // Killercoda
                        "https://*.killercoda.com"
                )

                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )

                .allowedHeaders("*")

                .allowCredentials(true);
    }
}