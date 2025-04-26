package com.interactive.model;

import lombok.Data;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class User {
    private UUID id;
    private String email;
    private String password;
    private String fullName;
    private String role;
    private Set<UUID> presentationIds = new HashSet<>();

    public User() {
        this.id = UUID.randomUUID();
    }
} 