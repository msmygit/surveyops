import apiClient from './client';
import { Presentation, PollQuestion, WordCloud } from '../types';

export const createPresentation = async (presentation: Omit<Presentation, 'id'>) => {
    const response = await apiClient.post('/presentations', presentation);
    return response.data;
};

export const getPresentation = async (id: string) => {
    const response = await apiClient.get(`/presentations/${id}`);
    return response.data;
};

export const addPollQuestion = async (presentationId: string, question: Omit<PollQuestion, 'id'>) => {
    const response = await apiClient.post(`/presentations/${presentationId}/questions`, question);
    return response.data;
};

export const addWordCloud = async (presentationId: string, wordCloud: Omit<WordCloud, 'id'>) => {
    const response = await apiClient.post(`/presentations/${presentationId}/wordclouds`, wordCloud);
    return response.data;
};

export const getQuestions = async (presentationId: string) => {
    const response = await apiClient.get(`/presentations/${presentationId}/questions`);
    return response.data;
};

export const getWordClouds = async (presentationId: string) => {
    const response = await apiClient.get(`/presentations/${presentationId}/wordclouds`);
    return response.data;
}; 