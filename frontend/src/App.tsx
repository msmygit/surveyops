import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { PresentationEditor } from './pages/PresentationEditor';
import { PresentationView } from './pages/PresentationView';
import { JoinPresentation } from './pages/JoinPresentation';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          <main className="container py-4 flex-grow-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presentations/:id/edit"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <PresentationEditor />
                  </ProtectedRoute>
                }
              />
              <Route path="/presentations/:id/join" element={<JoinPresentation />} />
              <Route path="/presentations/:id" element={<PresentationView />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
