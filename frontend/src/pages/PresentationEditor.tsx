import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Presentation, Slide, SlideType, CreateSlideDto } from '../types';
import { presentationApi } from '../services/api';
import { PollSlide } from '../components/slides/PollSlide';
import { WordCloudSlide } from '../components/slides/WordCloudSlide';
import { FreeformSlide } from '../components/slides/FreeformSlide';
import { SharePresentation } from '../components/SharePresentation';

export function PresentationEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newSlideType, setNewSlideType] = useState<SlideType>('POLL');

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

  const handleAddSlide = async () => {
    if (!presentation) return;

    const newSlide: CreateSlideDto = {
      type: newSlideType,
      title: `New ${newSlideType} Slide`,
      order: presentation.slides.length + 1,
    };

    try {
      const slide = await presentationApi.addSlide(presentation.id, newSlide);
      setPresentation({
        ...presentation,
        slides: [...presentation.slides, slide],
      });
      toast.success('Slide added successfully');
    } catch (error) {
      toast.error('Failed to add slide');
    }
  };

  const handleUpdateSlide = async (slide: Slide) => {
    if (!presentation) return;

    try {
      const updatedSlide = await presentationApi.updateSlide(
        presentation.id,
        slide.id,
        slide
      );
      setPresentation({
        ...presentation,
        slides: presentation.slides.map((s) =>
          s.id === slide.id ? updatedSlide : s
        ),
      });
      toast.success('Slide updated successfully');
    } catch (error) {
      toast.error('Failed to update slide');
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!presentation) return;

    try {
      await presentationApi.deleteSlide(presentation.id, slideId);
      setPresentation({
        ...presentation,
        slides: presentation.slides.filter((s) => s.id !== slideId),
      });
      toast.success('Slide deleted successfully');
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleToggleActive = async () => {
    if (!presentation) return;

    try {
      const updatedPresentation = await presentationApi.toggleActive(presentation.id);
      setPresentation(updatedPresentation);
      toast.success(
        `Presentation ${updatedPresentation.isActive ? 'activated' : 'deactivated'}`
      );
    } catch (error) {
      toast.error('Failed to toggle presentation status');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!presentation) {
    return <div className="text-center mt-5">Presentation not found</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{presentation.title}</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-info"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/presentations/${presentation.id}`)}
          >
            View
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <strong>Status:</strong>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={presentation.isActive}
              onChange={handleToggleActive}
            />
            <label className="form-check-label">
              {presentation.isActive ? 'Active' : 'Inactive'}
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            value={newSlideType}
            onChange={(e) => setNewSlideType(e.target.value as SlideType)}
          >
            <option value="POLL">Poll</option>
            <option value="WORDCLOUD">Word Cloud</option>
            <option value="FREEFORM">Freeform</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddSlide}>
            Add Slide
          </button>
        </div>
      </div>

      <div className="slides">
        {presentation.slides.map((slide) => {
          switch (slide.type) {
            case 'POLL':
              return (
                <PollSlide
                  key={slide.id}
                  slide={slide}
                  isAdmin
                  onUpdate={handleUpdateSlide}
                />
              );
            case 'WORDCLOUD':
              return (
                <WordCloudSlide
                  key={slide.id}
                  slide={slide}
                  isAdmin
                  onUpdate={handleUpdateSlide}
                />
              );
            case 'FREEFORM':
              return (
                <FreeformSlide
                  key={slide.id}
                  slide={slide}
                  isAdmin
                  onUpdate={handleUpdateSlide}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      {showShareModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Presentation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowShareModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <SharePresentation presentation={presentation} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 