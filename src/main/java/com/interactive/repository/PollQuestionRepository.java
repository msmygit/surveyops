package com.interactive.repository;

import com.interactive.model.PollQuestion;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PollQuestionRepository {
    PollQuestion save(PollQuestion pollQuestion);
    Optional<PollQuestion> findById(UUID id);
    List<PollQuestion> findByPresentationId(UUID presentationId);
    void deleteById(UUID id);
} 