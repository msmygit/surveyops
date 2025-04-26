package com.interactive.repository.impl;

import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import com.datastax.astra.client.core.query.Filter;
import com.datastax.astra.client.core.query.Filters;
import com.datastax.astra.client.databases.Database;
import com.interactive.model.WordCloud;
import com.interactive.repository.WordCloudRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AstraWordCloudRepository implements WordCloudRepository {
    private static final Logger logger = LoggerFactory.getLogger(AstraWordCloudRepository.class);
    private static final String COLLECTION_NAME = "word_clouds";

    private final Collection<Document> collection;

    @Autowired
    public AstraWordCloudRepository(Database database) {
        this.collection = database.getCollection(COLLECTION_NAME);
    }

    @Override
    public WordCloud save(WordCloud wordCloud) {
        try {
            Document doc = new Document()
                .append("_id", wordCloud.getId().toString())
                .append("presentationId", wordCloud.getPresentationId().toString())
                .append("prompt", wordCloud.getPrompt())
                .append("wordFrequencies", wordCloud.getWordFrequencies())
                .append("active", wordCloud.isActive());
            
            collection.insertOne(doc);
            logger.info("Saved word cloud with id: {}", wordCloud.getId());
            return wordCloud;
        } catch (Exception e) {
            logger.error("Error saving word cloud: {}", e.getMessage());
            throw new RuntimeException("Failed to save word cloud", e);
        }
    }

    @Override
    public Optional<WordCloud> findById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            return collection.findOne(filter).map(this::documentToWordCloud);
        } catch (Exception e) {
            logger.error("Error finding word cloud: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<WordCloud> findByPresentationId(UUID presentationId) {
        try {
            Filter filter = Filters.eq("presentationId", presentationId.toString());
            List<WordCloud> wordClouds = new ArrayList<>();
            collection.find(filter).forEach(doc -> 
                wordClouds.add(documentToWordCloud(doc))
            );
            return wordClouds;
        } catch (Exception e) {
            logger.error("Error finding word clouds by presentation: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public void deleteById(UUID id) {
        try {
            Filter filter = Filters.eq("_id", id.toString());
            collection.deleteOne(filter);
            logger.info("Deleted word cloud with id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting word cloud: {}", e.getMessage());
            throw new RuntimeException("Failed to delete word cloud", e);
        }
    }

    private WordCloud documentToWordCloud(Document doc) {
        WordCloud wordCloud = new WordCloud();
        wordCloud.setId(UUID.fromString(doc.getString("_id")));
        wordCloud.setPresentationId(UUID.fromString(doc.getString("presentationId")));
        wordCloud.setPrompt(doc.getString("prompt"));
        wordCloud.setWordFrequencies(doc.getMap("wordFrequencies", String.class, Integer.class));
        wordCloud.setActive(doc.getBoolean("active"));
        return wordCloud;
    }
} 