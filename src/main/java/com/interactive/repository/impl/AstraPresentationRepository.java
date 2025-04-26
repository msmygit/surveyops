package com.interactive.repository.impl;

import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import com.datastax.astra.client.core.query.Filter;
import com.datastax.astra.client.core.query.Filters;
import com.datastax.astra.client.databases.Database;
import com.interactive.model.Presentation;
import com.interactive.repository.PresentationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AstraPresentationRepository implements PresentationRepository {
    private static final Logger logger = LoggerFactory.getLogger(AstraPresentationRepository.class);
    private static final String COLLECTION_NAME = "presentations";

    private final Collection<Document> collection;

    @Autowired
    public AstraPresentationRepository(Database database) {
        this.collection = database.getCollection(COLLECTION_NAME);
    }

    @Override
    public Presentation save(Presentation presentation) {
        try {
            if (presentation.getId() == null) {
                presentation.setId(UUID.randomUUID());
            }
            Document doc = new Document()
                .append("_id", presentation.getId().toString())
                .append("title", presentation.getTitle())
                .append("presenterId", presentation.getPresenterId())
                .append("active", presentation.isActive())
                .append("createdAt", presentation.getCreatedAt().toString());
            
            if (presentation.getEndedAt() != null) {
                doc.append("endedAt", presentation.getEndedAt().toString());
            }
            
            collection.insertOne(doc);
            logger.info("Saved presentation with id: {}", presentation.getId());
            return presentation;
        } catch (Exception e) {
            logger.error("Error saving presentation: {}", e.getMessage());
            throw new RuntimeException("Failed to save presentation", e);
        }
    }

    @Override
    public Presentation findById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            Optional<Document> doc = collection.findOne(filter);
            return doc.map(this::documentToPresentation).orElse(null);
        } catch (Exception e) {
            logger.error("Error finding presentation: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<Presentation> findByActive(boolean active) {
        try {
            Filter filter = Filters.eq("active", active);
            List<Presentation> presentations = new ArrayList<>();
            collection.find(filter).forEach(doc -> 
                presentations.add(documentToPresentation(doc))
            );
            return presentations;
        } catch (Exception e) {
            logger.error("Error finding active presentations: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<Presentation> findByPresenterId(String presenterId) {
        try {
            Filter filter = Filters.eq("presenterId", presenterId);
            List<Presentation> presentations = new ArrayList<>();
            collection.find(filter).forEach(doc -> 
                presentations.add(documentToPresentation(doc))
            );
            return presentations;
        } catch (Exception e) {
            logger.error("Error finding presentations by presenter: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public void deleteById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            collection.deleteOne(filter);
            logger.info("Deleted presentation with id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting presentation: {}", e.getMessage());
            throw new RuntimeException("Failed to delete presentation", e);
        }
    }

    private Presentation documentToPresentation(Document doc) {
        Presentation presentation = new Presentation();
        presentation.setId(UUID.fromString(doc.getString("_id")));
        presentation.setTitle(doc.getString("title"));
        presentation.setPresenterId(doc.getString("presenterId"));
        presentation.setActive(doc.getBoolean("active"));
        presentation.setCreatedAt(LocalDateTime.parse(doc.getString("createdAt")));
        if (doc.containsKey("endedAt")) {
            presentation.setEndedAt(LocalDateTime.parse(doc.getString("endedAt")));
        }
        return presentation;
    }
} 