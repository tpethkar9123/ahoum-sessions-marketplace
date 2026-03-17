import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, BookmarkCheck, UserCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ margin: '3rem auto' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Profile Sidebar */}
        <aside className="glass card" style={{ flex: '1 1 300px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCircle size={60} color="white" />
            </div>
            <h2>{user?.first_name} {user?.last_name}</h2>
            <p className="text-muted">{user?.email}</p>
          </div>
          
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="text-muted">Role</span>
              <span className="btn-primary" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px' }}>{user?.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Member Since</span>
              <span>March 2026</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: '1 1 600px' }}>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <BookmarkCheck className="text-secondary" />
            My Bookings
          </h2>

          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="glass card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p className="text-muted">You haven't booked any sessions yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} className="glass card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{booking.session_details?.title}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }} className="text-muted">
                        <Calendar size={14} />
                        {new Date(booking.session_details?.date).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }} className="text-muted">
                        <Clock size={14} />
                        {booking.session_details?.time}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      background: booking.status === 'CONFIRMED' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                      color: booking.status === 'CONFIRMED' ? '#00ff00' : 'white'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
