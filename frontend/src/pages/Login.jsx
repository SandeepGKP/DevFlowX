import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, Mail, LogIn, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-8 animate-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl mb-2">
                <Shield className="text-blue-500" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400">Login to manage your deployments</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
              <LogIn size={20} /> Sign In
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-white py-4 rounded-2xl transition-all shadow-xl hover:shadow-blue-500/10"
            >
              <svg size={20} viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-bold text-lg">Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-bold">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
