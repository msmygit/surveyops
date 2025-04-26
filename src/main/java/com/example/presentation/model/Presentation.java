package com.example.presentation.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Presentation {
    private UUID id;
    private String title;
    private String presenterId;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
    private int currentSlideIndex;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPresenterId() {
        return presenterId;
    }

    public void setPresenterId(String presenterId) {
        this.presenterId = presenterId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public String getStatus() {
        return active ? "ACTIVE" : "ENDED";
    }

    public int getCurrentSlideIndex() {
        return currentSlideIndex;
    }

    public void setCurrentSlideIndex(int currentSlideIndex) {
        this.currentSlideIndex = currentSlideIndex;
    }
} 