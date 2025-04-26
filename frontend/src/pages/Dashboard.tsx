import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Presentation } from '../types';
import { presentationApi } from '../services/api';
import { SharePresentation } from '../components/SharePresentation';

export function Dashboard() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      const data = await presentationApi.getAll();
      setPresentations(data);
    } catch (error) {
      toast.error('Failed to load presentations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePresentation = () => {
    navigate('/presentations/new');
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedPresentation = await presentationApi.toggleActive(id);
      setPresentations(presentations.map(p => 
        p.id === id ? updatedPresentation : p
      ));
      toast.success(`Presentation ${updatedPresentation.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to toggle presentation status');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Presentations</h2>
        <button className="btn btn-primary" onClick={handleCreatePresentation}>
          Create New Presentation
        </button>
      </div>

      <div className="row">
        {presentations.map((presentation) => (
          <div key={presentation.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{presentation.title}</h5>
                <p className="card-text">{presentation.description}</p>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <strong>Status:</strong>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={presentation.isActive}
                      onChange={() => handleToggleActive(presentation.id)}
                    />
                    <label className="form-check-label">
                      {presentation.isActive ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Audience:</strong> {presentation.audienceCount} active
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/presentations/${presentation.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => setShowShareModal(presentation.id)}
                  >
                    Share
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/presentations/${presentation.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
                  onClick={() => setShowShareModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <SharePresentation
                  presentation={presentations.find(p => p.id === showShareModal)!}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 