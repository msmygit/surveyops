package com.interactive.repository.impl;

import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import com.datastax.astra.client.core.query.Filter;
import com.datastax.astra.client.core.query.Filters;
import com.datastax.astra.client.databases.Database;
import com.interactive.model.Response;
import com.interactive.repository.ResponseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AstraResponseRepository implements ResponseRepository {
    private static final Logger logger = LoggerFactory.getLogger(AstraResponseRepository.class);
    private static final String COLLECTION_NAME = "responses";

    private final Collection<Document> collection;

    @Autowired
    public AstraResponseRepository(Database database) {
        this.collection = database.getCollection(COLLECTION_NAME);
    }

    @Override
    public Response save(Response response) {
        try {
            Document doc = new Document()
                .append("_id", response.getId().toString())
                .append("pollQuestionId", response.getPollQuestionId().toString())
                .append("selectedOption", response.getSelectedOption())
                .append("createdAt", response.getCreatedAt().toString());
            
            collection.insertOne(doc);
            logger.info("Saved response with id: {}", response.getId());
            return response;
        } catch (Exception e) {
            logger.error("Error saving response: {}", e.getMessage());
            throw new RuntimeException("Failed to save response", e);
        }
    }

    @Override
    public Optional<Response> findById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            return collection.findOne(filter).map(this::documentToResponse);
        } catch (Exception e) {
            logger.error("Error finding response: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<Response> findByPollQuestionId(UUID pollQuestionId) {
        try {
            Filter filter = Filters.eq("pollQuestionId", pollQuestionId.toString());
            List<Response> responses = new ArrayList<>();
            collection.find(filter).forEach(doc -> 
                responses.add(documentToResponse(doc))
            );
            return responses;
        } catch (Exception e) {
            logger.error("Error finding responses by poll question: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public void deleteById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            collection.deleteOne(filter);
            logger.info("Deleted response with id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting response: {}", e.getMessage());
            throw new RuntimeException("Failed to delete response", e);
        }
    }

    private Response documentToResponse(Document doc) {
        Response response = new Response();
        response.setId(UUID.fromString(doc.getString("_id")));
        response.setPollQuestionId(UUID.fromString(doc.getString("pollQuestionId")));
        response.setSelectedOption(doc.getInteger("selectedOption"));
        response.setCreatedAt(java.time.LocalDateTime.parse(doc.getString("createdAt")));
        return response;
    }
} 