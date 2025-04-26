import React from 'react';
import { BaseSlide as BaseSlideType } from '../../types';

interface BaseSlideProps {
  slide: BaseSlideType;
  isAdmin?: boolean;
  onUpdate?: (slide: BaseSlideType) => void;
}

export function BaseSlide({ slide, isAdmin = false, onUpdate }: BaseSlideProps) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">{slide.title}</h5>
          {isAdmin && (
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onUpdate?.(slide)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onUpdate?.(slide)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="slide-content">
          {/* Content will be rendered by specific slide components */}
        </div>
      </div>
    </div>
  );
} 