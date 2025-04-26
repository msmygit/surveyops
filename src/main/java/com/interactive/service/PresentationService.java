package com.interactive.service;

import com.interactive.model.Presentation;
import com.interactive.repository.PresentationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PresentationService {
    private final PresentationRepository presentationRepository;

    @Autowired
    public PresentationService(PresentationRepository presentationRepository) {
        this.presentationRepository = presentationRepository;
    }

    public List<Presentation> getAllPresentations() {
        return presentationRepository.findAll();
    }

    public Presentation createPresentation(String title, String description) {
        Presentation presentation = new Presentation();
        presentation.setTitle(title);
        presentation.setDescription(description);
        presentation.setActive(true);
        return presentationRepository.save(presentation);
    }

    public Presentation updatePresentation(UUID id, String title) {
        Presentation presentation = presentationRepository.findById(id);
        if (presentation == null) {
            throw new RuntimeException("Presentation not found");
        }
        presentation.setTitle(title);
        return presentationRepository.save(presentation);
    }

    public void endPresentation(UUID id) {
        Presentation presentation = presentationRepository.findById(id);
        if (presentation == null) {
            throw new RuntimeException("Presentation not found");
        }
        presentation.setActive(false);
        presentationRepository.save(presentation);
    }

    public Presentation getPresentation(UUID id) {
        Presentation presentation = presentationRepository.findById(id);
        if (presentation == null) {
            throw new RuntimeException("Presentation not found");
        }
        return presentation;
    }

    public List<Presentation> getActivePresentations() {
        return presentationRepository.findByActive(true);
    }

    public List<Presentation> getPresentationsByPresenter(String presenterId) {
        return presentationRepository.findByPresenterId(presenterId);
    }
} 