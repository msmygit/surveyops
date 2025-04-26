package com.interactive.config;

import com.datastax.astra.client.DataAPIClient;
import com.datastax.astra.client.databases.Database;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AstraConfig {

    @Value("${astra.token}")
    private String astraToken;

    @Value("${astra.api-endpoint}")
    private String astraApiEndpoint;

    @Value("${astra.keyspace}")
    private String keyspace;

    @Bean
    public DataAPIClient dataApiClient() {
        return new DataAPIClient(astraToken);
    }

    @Bean
    public Database database(DataAPIClient client) {
        return client.getDatabase(astraApiEndpoint, keyspace);
    }
} 