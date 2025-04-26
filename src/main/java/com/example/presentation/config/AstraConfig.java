package com.example.presentation.config;

import com.datastax.astra.client.DataAPIClient;
import com.datastax.astra.client.collections.Collection;
import com.datastax.astra.client.collections.definition.documents.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AstraConfig {
    private static final Logger logger = LoggerFactory.getLogger(AstraConfig.class);

    @Value("${astra.token}")
    private String token;

    @Value("${astra.api-endpoint}")
    private String apiEndpoint;

    @Value("${astra.database-id}")
    private String databaseId;

    @Value("${astra.keyspace}")
    private String keyspace;

    @Bean
    public DataAPIClient dataAPIClient() {
        if (token == null || token.isEmpty()) {
            throw new IllegalStateException("Astra token is not set. Please set the ASTRA_TOKEN environment variable.");
        }
        logger.info("Initializing Astra Data API client with endpoint: {}", apiEndpoint);
        return new DataAPIClient(token);
    }

    @Bean
    public Collection<Document> presentationCollection(DataAPIClient client) {
        if (apiEndpoint == null || apiEndpoint.isEmpty() || keyspace == null || keyspace.isEmpty()) {
            throw new IllegalStateException("Astra API endpoint or keyspace is not set. Please check your configuration.");
        }
        logger.info("Creating collection in database: {}, keyspace: {}", apiEndpoint, keyspace);
        return client.getDatabase(apiEndpoint, keyspace)
                .createCollection("presentations");
    }
} 