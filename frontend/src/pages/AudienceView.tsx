import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface ActiveQuestion {
  id: number;
  question: string;
  type: string;
  options: string[];
}

const AudienceView = () => {
  const { presentationId } = useParams();
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [response, setResponse] = useState<string>('');
  const [stompClient, setStompClient] = useState<Client | null>(null);

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
      client.subscribe(`/topic/presentation/${presentationId}/active-question`, (message) => {
        const question = JSON.parse(message.body);
        setActiveQuestion(question);
        setResponse('');
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [presentationId]);

  const handleSubmitResponse = () => {
    if (activeQuestion && response) {
      stompClient?.publish({
        destination: `/app/presentation/${presentationId}/response`,
        body: JSON.stringify({
          questionId: activeQuestion.id,
          response,
        }),
      });
      setResponse('');
    }
  };

  const handleWordCloudSubmit = (word: string) => {
    if (word) {
      stompClient?.publish({
        destination: `/app/presentation/${presentationId}/wordcloud`,
        body: JSON.stringify({
          word,
        }),
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audience View
      </Typography>

      {activeQuestion ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {activeQuestion.question}
          </Typography>

          {activeQuestion.type === 'MULTIPLE_CHOICE' && (
            <RadioGroup
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            >
              {activeQuestion.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}

          {activeQuestion.type === 'OPEN_ENDED' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
            />
          )}

          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            sx={{ mt: 2 }}
          >
            Submit Response
          </Button>
        </Box>
      ) : (
        <Typography variant="body1">
          Waiting for the presenter to start a question...
        </Typography>
      )}
    </Box>
  );
};

export default AudienceView; 