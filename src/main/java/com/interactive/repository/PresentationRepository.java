package com.interactive.repository;

import com.interactive.model.Presentation;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PresentationRepository {
    Presentation save(Presentation presentation);
    Presentation findById(UUID id);
    void deleteById(UUID id);
    List<Presentation> findAll();
    List<Presentation> findByActive(boolean active);
    List<Presentation> findByPresenterId(String presenterId);
} 