package com.interactive.model;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
public class WordCloud {
    private UUID id;
    private String title;
    private Map<String, Integer> wordCounts;
    private UUID presentationId;
    private boolean isActive;

    public WordCloud() {
        this.id = UUID.randomUUID();
        this.wordCounts = new HashMap<>();
        this.isActive = true;
    }
} 