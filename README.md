# Interactive Presentations Platform

A web-based application that enables interactive presentations with real-time audience engagement through polls, quizzes, and word clouds.

## Features

- Real-time polling and responses
- Interactive word clouds
- QR code-based access
- Visual data representation
- Mobile-friendly interface
- Social media integration for sharing results

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL database
- Maven

## Backend Setup

1. Configure the database in `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/interactive_presentations
       username: your_username
       password: your_password
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/main/java/com/interactive/` - Backend Java code
  - `model/` - Entity classes
  - `controller/` - REST and WebSocket controllers
  - `service/` - Business logic
  - `repository/` - Data access layer

- `frontend/src/` - Frontend React code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `services/` - API services

## API Documentation

The backend API is available at `http://localhost:8080/api`:

- `POST /api/presentations` - Create a new presentation
- `GET /api/presentations/{id}` - Get presentation details
- `POST /api/presentations/{presentationId}/questions` - Create a new poll question
- `POST /api/presentations/{presentationId}/wordclouds` - Create a new word cloud

## WebSocket Endpoints

- `/ws` - WebSocket connection endpoint
- `/topic/presentation/{presentationId}/responses` - Subscribe to poll responses
- `/topic/presentation/{presentationId}/wordcloud` - Subscribe to word cloud updates
- `/app/presentation/{presentationId}/response` - Send poll responses
- `/app/presentation/{presentationId}/wordcloud` - Send word cloud contributions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 