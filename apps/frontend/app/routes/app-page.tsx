import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const API_BASE = 'http://localhost:3000/api';

export default function AppPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        const data = await res.json();
        setEmail(data.email || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Welcome to the application.</h1>
      {email && <p>Signed in as {email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
