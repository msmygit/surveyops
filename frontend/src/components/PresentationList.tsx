import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, Presentation } from '../services/api';

export const PresentationList = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ENDED'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      const data = await apiService.getPresentations();
      setPresentations(data);
    } catch (error) {
      toast.error('Failed to load presentations');
    } finally {
      setLoading(false);
    }
  };

  const handleEndPresentation = async (id: string) => {
    try {
      await apiService.endPresentation(id);
      toast.success('Presentation ended successfully');
      loadPresentations();
    } catch (error) {
      toast.error('Failed to end presentation');
    }
  };

  const filteredPresentations = presentations.filter(presentation => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presentation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || presentation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Presentations</h2>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          Create New Presentation
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search presentations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'ENDED')}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>
      </div>

      <div className="list-group">
        {filteredPresentations.map((presentation) => (
          <div key={presentation.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{presentation.title}</h5>
                <p className="mb-1">{presentation.description}</p>
                <small className={`text-${presentation.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                  Status: {presentation.status}
                </small>
              </div>
              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => navigate(`/presentations/${presentation.id}`)}
                >
                  View Details
                </button>
                {presentation.status === 'ACTIVE' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEndPresentation(presentation.id)}
                  >
                    End Presentation
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 