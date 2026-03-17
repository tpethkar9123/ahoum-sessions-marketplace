import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Compass, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass container" style={{ 
      margin: '1rem auto', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Compass className="text-primary" />
        <span>SpiritualTech</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" className="text-muted" style={{ fontWeight: 500 }}>Browse</Link>
        
        {user ? (
          <>
            <Link to={user.role === 'CREATOR' ? '/creator-dashboard' : '/user-dashboard'} className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.first_name || user.username}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{user.role}</p>
              </div>
              <button onClick={() => logout()} style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', padding: '0.5rem', borderRadius: '50%' }}>
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Get Started</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
