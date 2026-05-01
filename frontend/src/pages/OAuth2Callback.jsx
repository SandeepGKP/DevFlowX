import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // We don't have user info yet, but the token is valid
      // In a real app, we might fetch user info here
      localStorage.setItem('user', JSON.stringify({ name: 'OAuth User', email: 'Logged in via Social' }));
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-bold tracking-widest animate-pulse">SYNCHRONIZING PROFILE...</p>
      </div>
    </div>
  );
}
