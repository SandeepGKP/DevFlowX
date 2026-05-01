import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, Mail, User, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-600/10 rounded-2xl mb-2">
                <Shield className="text-emerald-500" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-slate-400">Join the next generation of CI/CD</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-emerald-500 hover:underline font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
