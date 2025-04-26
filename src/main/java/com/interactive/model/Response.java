package com.interactive.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Response {
    private UUID id;
    private UUID pollQuestionId;
    private int selectedOption;
    private LocalDateTime createdAt;

    public Response() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
    }
} 