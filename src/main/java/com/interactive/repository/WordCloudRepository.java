package com.interactive.repository;

import com.interactive.model.WordCloud;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WordCloudRepository {
    WordCloud save(WordCloud wordCloud);
    Optional<WordCloud> findById(UUID id);
    List<WordCloud> findByPresentationId(UUID presentationId);
    void deleteById(UUID id);
} 