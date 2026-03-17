import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Settings, Users, Briefcase, Trash2 } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    price: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        api.get('/sessions/'),
        api.get('/bookings/')
      ]);
      // Filter sessions by creator if not already done by backend
      setSessions(sessionsRes.data.filter(s => s.creator === user?.id || s.creator_name === user?.first_name + ' ' + user?.last_name));
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching creator data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions/', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', date: '', time: '', price: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create session.');
    }
  };

  return (
    <div className="container animate-fade" style={{ margin: '3rem auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1>Creator Dashboard</h1>
          <p className="text-muted">Manage your offerings and view attendee bookings.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Create Session'}
        </button>
      </header>

      {showForm && (
        <div className="glass card animate-fade" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>New Session Information</h2>
          <form onSubmit={handleCreateSession} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Title</label>
              <input 
                type="text" required className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white' }}
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Description</label>
              <textarea 
                required className="glass" rows="4" style={{ width: '100%', padding: '0.8rem', color: 'white', resize: 'vertical' }}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Date</label>
              <input 
                type="date" required className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white' }}
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Time</label>
              <input 
                type="time" required className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white' }}
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Price (USD)</label>
              <input 
                type="number" required className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white' }}
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Publish Session</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Briefcase size={22} className="text-primary" />
            My Active Sessions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sessions.length === 0 ? <p className="text-muted">No sessions created.</p> : sessions.map(s => (
              <div key={s.id} className="glass card" style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{s.title}</h4>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{s.date} at {s.time}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>${s.price}</span>
                  <button className="text-muted" style={{ padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,0,0,0.1)' }}>
                    <Trash2 size={16} color="#ff4d4d" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Users size={22} className="text-secondary" />
            Received Bookings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.length === 0 ? <p className="text-muted">No bookings received yet.</p> : bookings.map(b => (
              <div key={b.id} className="glass card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 600 }}>{b.session_details?.title}</h4>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--primary)', borderRadius: '10px' }}>{b.status}</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Booked by Attendee ID: {b.user.substring(0,8)}...</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreatorDashboard;
