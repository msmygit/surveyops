package com.example.presentation.service.impl;

import com.example.presentation.model.Presentation;
import com.example.presentation.repository.AstraPresentationRepository;
import com.example.presentation.service.PresentationService;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PresentationServiceImpl implements PresentationService {

    private final AstraPresentationRepository presentationRepository;

    public PresentationServiceImpl(AstraPresentationRepository presentationRepository) {
        this.presentationRepository = presentationRepository;
    }

    @Override
    public Presentation createPresentation(Presentation presentation) {
        if (presentation.getId() == null) {
            presentation.setId(UUID.randomUUID());
        }
        presentation.setActive(true);
        presentation.setCurrentSlideIndex(0);
        return presentationRepository.save(presentation);
    }

    @Override
    public Presentation updatePresentation(Presentation presentation) {
        return presentationRepository.save(presentation);
    }

    @Override
    public Presentation endPresentation(UUID presentationId) {
        Presentation presentation = presentationRepository.findById(presentationId);
        if (presentation == null) {
            throw new RuntimeException("Presentation not found");
        }
        presentation.setActive(false);
        return presentationRepository.save(presentation);
    }

    @Override
    public Presentation getPresentation(UUID presentationId) {
        Presentation presentation = presentationRepository.findById(presentationId);
        if (presentation == null) {
            throw new RuntimeException("Presentation not found");
        }
        return presentation;
    }
} 