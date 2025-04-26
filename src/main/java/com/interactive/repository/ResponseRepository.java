package com.interactive.repository;

import com.interactive.model.Response;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResponseRepository {
    Response save(Response response);
    Optional<Response> findById(UUID id);
    List<Response> findByPollQuestionId(UUID pollQuestionId);
    void deleteById(UUID id);
} 