package com.interactive.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class Presentation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String title;
    private String description;
    private String accessCode;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
    private boolean active;
    private String presenterId;
    private Set<UUID> pollQuestionIds = new HashSet<>();
    private Set<UUID> wordCloudIds = new HashSet<>();

    public Presentation() {
        this.createdAt = LocalDateTime.now();
    }
} 