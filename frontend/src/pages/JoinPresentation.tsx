import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { presentationApi } from '../services/api';

export function JoinPresentation() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await presentationApi.join({
        accessCode,
        name,
      });
      toast.success('Successfully joined the presentation!');
      navigate(`/presentations/${id}/view`);
    } catch (error) {
      toast.error('Failed to join presentation. Please check the access code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Join Presentation</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="accessCode" className="form-label">
                    Access Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Joining...' : 'Join Presentation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 