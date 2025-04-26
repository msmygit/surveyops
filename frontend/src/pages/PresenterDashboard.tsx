import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { QRCodeSVG } from 'react-qr-code';
import * as d3 from 'd3';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface PollQuestion {
  id: number;
  question: string;
  type: string;
  options: string[];
  responses: { [key: string]: number };
}

interface WordCloud {
  id: number;
  prompt: string;
  wordFrequencies: { [key: string]: number };
}

const PresenterDashboard = () => {
  const { presentationId } = useParams();
  const [pollQuestions, setPollQuestions] = useState<PollQuestion[]>([]);
  const [wordClouds, setWordClouds] = useState<WordCloud[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/api/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        login: 'user',
        passcode: 'password',
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/presentation/${presentationId}/responses`, (message) => {
        const response = JSON.parse(message.body);
        updatePollResponses(response);
      });

      client.subscribe(`/topic/presentation/${presentationId}/wordcloud`, (message) => {
        const wordCloud = JSON.parse(message.body);
        updateWordCloud(wordCloud);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [presentationId]);

  const updatePollResponses = (response: any) => {
    setPollQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === response.questionId
          ? {
              ...question,
              responses: {
                ...question.responses,
                [response.option]: (question.responses[response.option] || 0) + 1,
              },
            }
          : question
      )
    );
  };

  const updateWordCloud = (wordCloud: WordCloud) => {
    setWordClouds((prevClouds) =>
      prevClouds.map((cloud) =>
        cloud.id === wordCloud.id ? { ...cloud, wordFrequencies: wordCloud.wordFrequencies } : cloud
      )
    );
  };

  const createNewPoll = () => {
    // Implementation for creating a new poll
  };

  const createNewWordCloud = () => {
    // Implementation for creating a new word cloud
  };

  const activateQuestion = (questionId: number) => {
    setActiveQuestion(questionId);
    stompClient?.publish({
      destination: `/app/presentation/${presentationId}/activate`,
      body: JSON.stringify({ questionId }),
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Presentation Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Poll Questions
            </Typography>
            <Button variant="contained" onClick={createNewPoll} sx={{ mb: 2 }}>
              New Poll
            </Button>
            {pollQuestions.map((question) => (
              <Box key={question.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{question.question}</Typography>
                {/* Add D3.js visualization for poll results */}
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Word Clouds
            </Typography>
            <Button variant="contained" onClick={createNewWordCloud} sx={{ mb: 2 }}>
              New Word Cloud
            </Button>
            {wordClouds.map((cloud) => (
              <Box key={cloud.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{cloud.prompt}</Typography>
                {/* Add D3.js visualization for word cloud */}
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Join Code
            </Typography>
            <QRCodeSVG value={`http://localhost:3000/audience/${presentationId}`} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PresenterDashboard; 