package com.interactive.controller;

import com.interactive.model.Presentation;
import com.interactive.service.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/presentations")
public class PresentationController {
    private final PresentationService presentationService;

    @Autowired
    public PresentationController(PresentationService presentationService) {
        this.presentationService = presentationService;
    }

    @GetMapping
    public ResponseEntity<List<Presentation>> getAllPresentations() {
        return ResponseEntity.ok(presentationService.getAllPresentations());
    }

    @PostMapping
    public ResponseEntity<Presentation> createPresentation(
            @RequestParam String title,
            @RequestParam String description) {
        return ResponseEntity.ok(presentationService.createPresentation(title, description));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presentation> updatePresentation(
            @PathVariable UUID id,
            @RequestParam String title) {
        return ResponseEntity.ok(presentationService.updatePresentation(id, title));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Void> endPresentation(@PathVariable UUID id) {
        presentationService.endPresentation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presentation> getPresentation(@PathVariable UUID id) {
        return ResponseEntity.ok(presentationService.getPresentation(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Presentation>> getActivePresentations() {
        return ResponseEntity.ok(presentationService.getActivePresentations());
    }

    @GetMapping("/presenter/{presenterId}")
    public ResponseEntity<List<Presentation>> getPresentationsByPresenter(
            @PathVariable String presenterId) {
        return ResponseEntity.ok(presentationService.getPresentationsByPresenter(presenterId));
    }
} 