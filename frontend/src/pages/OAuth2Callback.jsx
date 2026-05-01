import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract info from URL search parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const name = params.get('name');

    if (token) {
      // Save token and the REAL user info from Google
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        email: email || 'user@devflowx.com', 
        name: name || 'User' 
      }));
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest">Finalizing secure session...</p>
      </div>
    </div>
  );
}
