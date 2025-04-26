export type PresentationStatus = 'ACTIVE' | 'ENDED';

export interface Presentation {
  id: string;
  title: string;
  description: string;
  status: PresentationStatus;
  createdAt: string;
  endedAt?: string;
}

export interface CreatePresentationDto {
  title: string;
  description: string;
}

export interface UpdatePresentationDto {
  title?: string;
  description?: string;
  status?: PresentationStatus;
} 