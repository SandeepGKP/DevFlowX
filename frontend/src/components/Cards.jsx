export default function Cards({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
          <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
