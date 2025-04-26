import React, { useState } from 'react';
import { Slide } from '../../types';

interface PollSlideProps {
  slide: Slide;
  onSubmit: (response: { optionId: string }) => void;
}

export function PollSlide({ slide, onSubmit }: PollSlideProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      onSubmit({ optionId: selectedOption });
    }
  };

  return (
    <div className="poll-slide">
      <p className="mb-4">{slide.content}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          {slide.options?.map((option) => (
            <div key={option.id} className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="pollOption"
                id={`option-${option.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label className="form-check-label" htmlFor={`option-${option.id}`}>
                {option.text}
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedOption}
        >
          Submit
        </button>
      </form>
    </div>
  );
} 