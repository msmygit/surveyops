export type UserRole = 'ADMIN' | 'AUDIENCE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export type SlideType = 'POLL' | 'QUIZ' | 'WORDCLOUD' | 'FREEFORM';

export interface BaseSlide {
  id: string;
  type: SlideType;
  title: string;
  order: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollSlide extends BaseSlide {
  type: 'POLL';
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizSlide extends BaseSlide {
  type: 'QUIZ';
  question: string;
  options: QuizOption[];
  allowMultiple: boolean;
}

export interface WordCloudSlide extends BaseSlide {
  type: 'WORDCLOUD';
  prompt: string;
  words: { text: string; size: number }[];
}

export interface FreeformSlide extends BaseSlide {
  type: 'FREEFORM';
  prompt: string;
  responses: { id: string; text: string; createdAt: string }[];
}

export type Slide = PollSlide | QuizSlide | WordCloudSlide | FreeformSlide;

export interface Presentation {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  accessCode: string; // 6-digit code for audience to join
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
  createdBy: string;
  audienceCount: number; // Number of active audience members
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreatePresentationDto {
  title: string;
  description: string;
}

export interface JoinPresentationDto {
  accessCode: string;
  name: string; // Audience member's name
}

export interface CreateSlideDto {
  type: SlideType;
  title: string;
  order: number;
  // Additional fields based on slide type
  question?: string;
  options?: (PollOption | QuizOption)[];
  prompt?: string;
  allowMultiple?: boolean;
}

export interface AudienceMember {
  id: string;
  name: string;
  joinedAt: string;
  presentationId: string;
}

export interface PollQuestion {
    id: string; // UUID format
    presentationId: string; // UUID format
    question: string;
    options: string[];
    active: boolean;
}

export interface WordCloud {
    id: string; // UUID format
    presentationId: string; // UUID format
    prompt: string;
    wordFrequencies: { [key: string]: number };
    active: boolean;
}

export interface Response {
    id: string;
    pollQuestionId: string;
    selectedOption: number;
    createdAt: string;
} 