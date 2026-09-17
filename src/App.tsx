import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './lib/axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ApplicationDetail from './pages/ApplicationDetail';
import ApplicantsList from './pages/ApplicantsList';

function App() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me').then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-primary">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-card border-b border-border p-4 flex justify-between items-center sticky top-0 z-10">
        <Link to="/" className="text-xl font-bold text-primary hover:opacity-80 transition">IndoKerja</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-foreground">Welcome, <strong className="text-primary">{user.name}</strong></span>
              <Link to="/dashboard" className="px-4 py-2 bg-border text-foreground rounded-md text-sm hover:bg-border/80 transition">Dashboard</Link>
              <button onClick={handleLogout} className="px-4 py-2 border border-border text-foreground rounded-md text-sm hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-foreground font-medium hover:text-primary transition">Log in</Link>
              <Link to="/register" className="px-4 py-2 bg-primary rounded-md text-white font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20">Sign up</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/applications/:id" element={<ApplicationDetail user={user} />} />
          <Route path="/jobs/:id/applicants" element={<ApplicantsList user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
