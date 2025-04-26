package com.interactive.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class PollQuestion {
    private UUID id;
    private String question;
    private List<String> options;
    private List<Integer> votes;
    private UUID presentationId;
    private boolean isActive;
    private LocalDateTime createdAt;

    public PollQuestion() {
        this.id = UUID.randomUUID();
        this.options = new ArrayList<>();
        this.votes = new ArrayList<>();
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }
} 