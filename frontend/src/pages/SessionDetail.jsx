import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, DollarSign, User, ShieldCheck } from 'lucide-react';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const res = await api.get(`/sessions/${id}/`);
      setSession(res.data);
    } catch (err) {
      console.error('Error fetching session', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBooking(true);
    try {
      // 1. Create Payment Intent
      const { data } = await api.post('/payments/create-intent/', { session_id: id });
      
      // 2. Simulate User confirming Payment (Client-side Stripe Logic would go here)
      alert(`Payment Processing... Client Secret: ${data.clientSecret.substring(0, 15)}...`);
      
      // 3. Confirm Booking
      await api.post('/bookings/', { session: id });
      alert('Session booked successfully!');
      navigate('/user-dashboard');
    } catch (err) {
      alert('Booking or Payment failed.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!session) return <div className="container">Session not found.</div>;

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <div className="glass card" style={{ padding: '0', overflow: 'hidden' }}>
        {session.image && (
          <img src={session.image} alt={session.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        )}
        <div style={{ padding: '3rem' }}>
          <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>{session.title}</h1>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar className="text-secondary" size={20} />
            <span>{new Date(session.date).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock className="text-secondary" size={20} />
            <span>{session.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <DollarSign className="text-primary" size={20} />
            <span>{session.price}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User className="text-muted" size={20} />
            <span>{session.creator_name}</span>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>About this session</h3>
          <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{session.description}</p>
        </div>

        <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Secure your spot now</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{session.price} USD</p>
          </div>
          <button 
            onClick={handleBook} 
            disabled={booking} 
            className="btn-primary" 
            style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
          >
            <ShieldCheck size={20} />
            {booking ? 'Processing...' : 'Book Now'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
