package com.example.presentation.service;

import com.example.presentation.model.Presentation;
import java.util.UUID;

public interface PresentationService {
    Presentation createPresentation(Presentation presentation);
    Presentation updatePresentation(Presentation presentation);
    Presentation endPresentation(UUID presentationId);
    Presentation getPresentation(UUID presentationId);
} 