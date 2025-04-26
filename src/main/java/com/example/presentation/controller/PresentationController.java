package com.example.presentation.controller;

import com.example.presentation.model.Presentation;
import com.example.presentation.service.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/presentations")
public class PresentationController {

    private final PresentationService presentationService;

    @Autowired
    public PresentationController(PresentationService presentationService) {
        this.presentationService = presentationService;
    }

    @PostMapping
    public ResponseEntity<Presentation> createPresentation(@RequestBody Presentation presentation) {
        return ResponseEntity.ok(presentationService.createPresentation(presentation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presentation> updatePresentation(
            @PathVariable UUID id,
            @RequestBody Presentation presentation) {
        presentation.setId(id);
        return ResponseEntity.ok(presentationService.updatePresentation(presentation));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Presentation> endPresentation(@PathVariable UUID id) {
        return ResponseEntity.ok(presentationService.endPresentation(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presentation> getPresentation(@PathVariable UUID id) {
        return ResponseEntity.ok(presentationService.getPresentation(id));
    }
} 