import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Clock, DollarSign, ArrowRight } from 'lucide-react';

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions/');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade">
      <header style={{ margin: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Find Your Inner <span style={{ color: 'var(--secondary)' }}>Balance</span></h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Connect with spiritual guides and transform your life with one-on-one sessions.
        </p>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Available Sessions</h2>
        
        {loading ? (
          <p>Loading sessions...</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {sessions.map(session => (
              <div key={session.id} className="glass card animate-fade" style={{ padding: 0, overflow: 'hidden' }}>
                {session.image && (
                  <img src={session.image} alt={session.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>{session.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                    {session.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Calendar size={16} className="text-secondary" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Clock size={16} className="text-secondary" />
                      <span>{session.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                      <DollarSign size={16} className="text-primary" />
                      <span>{session.price}</span>
                    </div>
                  </div>

                  <Link to={`/sessions/${session.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    View Details <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
