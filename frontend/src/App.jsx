import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SessionDetail from './pages/SessionDetail';
import UserDashboard from './pages/UserDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import './index.css';

// Placeholder Google Client ID - User should replace this in .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789-example.apps.googleusercontent.com";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sessions/:id" element={<SessionDetail />} />
                
                <Route 
                  path="/user-dashboard" 
                  element={
                    <ProtectedRoute role="USER">
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/creator-dashboard" 
                  element={
                    <ProtectedRoute role="CREATOR">
                      <CreatorDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <footer className="container" style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5, fontSize: '0.9rem' }}>
              &copy; 2026 Ahoum SpiritualTech. All rights reserved.
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
