package com.interactive.repository.impl;

import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import com.datastax.astra.client.core.query.Filter;
import com.datastax.astra.client.core.query.Filters;
import com.datastax.astra.client.databases.Database;
import com.interactive.model.PollQuestion;
import com.interactive.repository.PollQuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Repository
public class AstraPollQuestionRepository implements PollQuestionRepository {
    private static final Logger logger = LoggerFactory.getLogger(AstraPollQuestionRepository.class);
    private static final String COLLECTION_NAME = "poll_questions";

    private final Collection<Document> collection;

    @Autowired
    public AstraPollQuestionRepository(Database database) {
        this.collection = database.getCollection(COLLECTION_NAME);
    }

    @Override
    public PollQuestion save(PollQuestion pollQuestion) {
        try {
            if (pollQuestion.getId() == null) {
                pollQuestion.setId(UUID.randomUUID());
            }
            Document doc = new Document()
                .append("_id", pollQuestion.getId().toString())
                .append("presentationId", pollQuestion.getPresentationId().toString())
                .append("question", pollQuestion.getQuestion())
                .append("options", pollQuestion.getOptions())
                .append("active", pollQuestion.isActive())
                .append("createdAt", pollQuestion.getCreatedAt().toString());
            
            collection.insertOne(doc);
            logger.info("Saved poll question with id: {}", pollQuestion.getId());
            return pollQuestion;
        } catch (Exception e) {
            logger.error("Error saving poll question: {}", e.getMessage());
            throw new RuntimeException("Failed to save poll question", e);
        }
    }

    @Override
    public Optional<PollQuestion> findById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            return collection.findOne(filter).map(this::documentToPollQuestion);
        } catch (Exception e) {
            logger.error("Error finding poll question: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<PollQuestion> findByPresentationId(UUID presentationId) {
        try {
            Filter filter = Filters.eq("presentationId", presentationId.toString());
            List<PollQuestion> questions = new ArrayList<>();
            collection.find(filter).forEach(doc -> 
                questions.add(documentToPollQuestion(doc))
            );
            return questions;
        } catch (Exception e) {
            logger.error("Error finding poll questions by presentation: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public void deleteById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            collection.deleteOne(filter);
            logger.info("Deleted poll question with id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting poll question: {}", e.getMessage());
            throw new RuntimeException("Failed to delete poll question", e);
        }
    }

    private PollQuestion documentToPollQuestion(Document doc) {
        PollQuestion question = new PollQuestion();
        question.setId(UUID.fromString(doc.getString("_id")));
        question.setPresentationId(UUID.fromString(doc.getString("presentationId")));
        question.setQuestion(doc.getString("question"));
        question.setOptions(doc.getList("options", String.class));
        question.setActive(doc.getBoolean("active"));
        question.setCreatedAt(LocalDateTime.parse(doc.getString("createdAt")));
        return question;
    }
} 