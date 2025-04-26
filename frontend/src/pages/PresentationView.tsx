import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Presentation, Slide } from '../types';
import { presentationApi } from '../services/api';
import { PollSlide } from '../components/slides/PollSlide';
import { WordCloudSlide } from '../components/slides/WordCloudSlide';
import { FreeformSlide } from '../components/slides/FreeformSlide';

export function PresentationView() {
  const { id } = useParams<{ id: string }>();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadPresentation();
    }
  }, [id]);

  const loadPresentation = async () => {
    try {
      const data = await presentationApi.getById(id!);
      setPresentation(data);
    } catch (error) {
      toast.error('Failed to load presentation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (slide: Slide, response: any) => {
    if (!presentation) return;

    try {
      await presentationApi.submitResponse(presentation.id, slide.id, response);
      toast.success('Response submitted successfully');
    } catch (error) {
      toast.error('Failed to submit response');
    }
  };

  const handleNextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!presentation) {
    return <div className="text-center mt-5">Presentation not found</div>;
  }

  if (!presentation.isActive) {
    return <div className="text-center mt-5">This presentation is not active</div>;
  }

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{presentation.title}</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={handlePreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === presentation.slides.length - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="slide-container">
        {currentSlide && (
          <div className="slide">
            <h3 className="mb-4">{currentSlide.title}</h3>
            {currentSlide.type === 'POLL' && (
              <PollSlide
                slide={currentSlide}
                onSubmit={(response) => handleSubmitResponse(currentSlide, response)}
              />
            )}
            {currentSlide.type === 'WORDCLOUD' && (
              <WordCloudSlide
                slide={currentSlide}
                onSubmit={(response) => handleSubmitResponse(currentSlide, response)}
              />
            )}
            {currentSlide.type === 'FREEFORM' && (
              <FreeformSlide
                slide={currentSlide}
                onSubmit={(response) => handleSubmitResponse(currentSlide, response)}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <span>
          Slide {currentSlideIndex + 1} of {presentation.slides.length}
        </span>
      </div>
    </div>
  );
} 