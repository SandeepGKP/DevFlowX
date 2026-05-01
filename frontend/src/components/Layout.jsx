import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, ShieldAlert, BarChart3, LogOut, User } from 'lucide-react';
import { authService } from '../services/api';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 group
      ${active ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
  >
    <Icon size={20} className={`${active ? 'text-blue-400' : 'group-hover:text-slate-200'}`} />
    <span className="font-semibold text-sm tracking-wide uppercase">{label}</span>
  </Link>
);

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">DevFlow<span className="text-blue-500 text-3xl italic">X</span></span>
          </div>
        </div>

        <nav className="flex-1 mt-4">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
          <SidebarLink to="/releases" icon={History} label="Releases" active={location.pathname === '/releases'} />
          <SidebarLink to="/analytics" icon={BarChart3} label="Analytics" active={location.pathname === '/analytics'} />
          <SidebarLink to="/security" icon={ShieldAlert} label="Security Scan" active={location.pathname === '/security'} />
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="User" /> : <User size={20} className="text-slate-400" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-tighter truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 min-h-screen relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/5 blur-[120px] -z-10 rounded-full"></div>
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
