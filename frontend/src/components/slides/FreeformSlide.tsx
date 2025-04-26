import React, { useState } from 'react';
import { FreeformSlide as FreeformSlideType } from '../../types';
import { BaseSlide } from './BaseSlide';

interface FreeformSlideProps {
  slide: FreeformSlideType;
  isAdmin?: boolean;
  onUpdate?: (slide: FreeformSlideType) => void;
  onSubmit?: (response: string) => void;
}

export function FreeformSlide({ slide, isAdmin, onUpdate, onSubmit }: FreeformSlideProps) {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit?.(response.trim());
      setResponse('');
    }
  };

  return (
    <BaseSlide slide={slide} isAdmin={isAdmin} onUpdate={onUpdate}>
      <div className="slide-content">
        <p className="mb-4">{slide.prompt}</p>
        
        {isAdmin ? (
          <div className="responses">
            {slide.responses.map((response) => (
              <div key={response.id} className="card mb-2">
                <div className="card-body">
                  <p className="card-text">{response.text}</p>
                  <small className="text-muted">
                    {new Date(response.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <textarea
              className="form-control mb-3"
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response..."
            />
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!response.trim()}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </BaseSlide>
  );
} 