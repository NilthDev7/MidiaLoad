package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> rootHealthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "MediaLoad Backend Service is running smoothly.",
            "version", "1.0.0"
        ));
    }
}
