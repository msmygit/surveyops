import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Presentation } from '../types';

interface SharePresentationProps {
  presentation: Presentation;
}

export function SharePresentation({ presentation }: SharePresentationProps) {
  const [copied, setCopied] = useState(false);
  const audienceUrl = `${window.location.origin}/presentations/${presentation.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(audienceUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Share Presentation</h5>
        <div className="mb-3">
          <label className="form-label">Access Code</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={presentation.accessCode}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(presentation.accessCode);
                toast.success('Access code copied!');
              }}
            >
              Copy
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Audience URL</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={audienceUrl}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="alert alert-info">
          <strong>Instructions:</strong>
          <ol className="mb-0 mt-2">
            <li>Share the URL with your audience</li>
            <li>They will need to enter the access code to join</li>
            <li>You can start/stop audience interaction using the toggle button</li>
          </ol>
        </div>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <strong>Status:</strong>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={presentation.isActive}
              readOnly
            />
            <label className="form-check-label">
              {presentation.isActive ? 'Active' : 'Inactive'}
            </label>
          </div>
        </div>
        <div className="mt-3">
          <strong>Active Audience:</strong> {presentation.audienceCount}
        </div>
      </div>
    </div>
  );
} 