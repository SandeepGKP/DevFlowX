import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Rocket, ShieldCheck, Terminal, RotateCcw } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Releases', path: '/releases', icon: <Rocket size={20} /> },
    { name: 'Security Scan', path: '/security', icon: <ShieldCheck size={20} /> },
    { name: 'Logs', path: '/logs', icon: <Terminal size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
          <Rocket className="text-blue-400" />
          DevFlowX
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">DevSecOps Platform</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
            A
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-200">Admin User</p>
            <p className="text-xs text-slate-400">DevOps Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
