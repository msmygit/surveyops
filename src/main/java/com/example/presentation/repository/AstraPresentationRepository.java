package com.example.presentation.repository;

import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import com.datastax.astra.client.core.query.Filter;
import com.datastax.astra.client.core.query.Filters;
import com.example.presentation.exception.PresentationNotFoundException;
import com.example.presentation.model.Presentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class AstraPresentationRepository {

    private static final Logger logger = LoggerFactory.getLogger(AstraPresentationRepository.class);
    private final Collection<Document> collection;

    public AstraPresentationRepository(Collection<Document> collection) {
        this.collection = collection;
    }

    public Presentation save(Presentation presentation) {
        try {
            if (presentation.getId() == null) {
                presentation.setId(UUID.randomUUID());
            }
            if (presentation.getCreatedAt() == null) {
                presentation.setCreatedAt(java.time.LocalDateTime.now());
            }

            Document document = new Document()
                .append("_id", presentation.getId().toString())
                .append("title", presentation.getTitle())
                .append("presenterId", presentation.getPresenterId())
                .append("active", presentation.isActive())
                .append("createdAt", presentation.getCreatedAt().toString())
                .append("endedAt", presentation.getEndedAt() != null ? presentation.getEndedAt().toString() : null)
                .append("currentSlideIndex", presentation.getCurrentSlideIndex());

            collection.insertOne(document);
            logger.info("Saved presentation with ID: {}", presentation.getId());
            return presentation;
        } catch (Exception e) {
            logger.error("Error saving presentation: {}", e.getMessage());
            throw new RuntimeException("Failed to save presentation", e);
        }
    }

    public Presentation findById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            Optional<Document> result = collection.findOne(filter);
            
            if (result.isEmpty()) {
                throw new PresentationNotFoundException("Presentation not found with ID: " + id);
            }

            Document doc = result.get();
            Presentation presentation = new Presentation();
            presentation.setId(UUID.fromString(doc.getString("_id")));
            presentation.setTitle(doc.getString("title"));
            presentation.setPresenterId(doc.getString("presenterId"));
            presentation.setActive(doc.getBoolean("active"));
            presentation.setCreatedAt(java.time.LocalDateTime.parse(doc.getString("createdAt")));
            if (doc.getString("endedAt") != null) {
                presentation.setEndedAt(java.time.LocalDateTime.parse(doc.getString("endedAt")));
            }
            Integer slideIndex = doc.getInteger("currentSlideIndex");
            presentation.setCurrentSlideIndex(slideIndex != null ? slideIndex : 0);

            return presentation;
        } catch (PresentationNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error finding presentation: {}", e.getMessage());
            throw new RuntimeException("Failed to find presentation", e);
        }
    }

    public void deleteById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            collection.deleteOne(filter);
            logger.info("Deleted presentation with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting presentation: {}", e.getMessage());
            throw new RuntimeException("Failed to delete presentation", e);
        }
    }
} 