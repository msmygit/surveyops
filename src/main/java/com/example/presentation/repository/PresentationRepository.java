package com.example.presentation.repository;

import com.example.presentation.model.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PresentationRepository extends JpaRepository<Presentation, UUID> {
} 