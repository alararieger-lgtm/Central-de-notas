
import React, { useMemo } from 'react';
import { AppData, PerformanceStatus } from '../types';
import { calculateTrimesterAverage, getStatus, getStatusColor } from '../gradeUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC<{ data: AppData }> = ({ data }) => {
  const { subjects, currentTrimester, studySession, user } = data;

  const stats = useMemo(() => {
    if (subjects.length === 0) return null;
    const subjectsWithGrades = subjects.map(s => {
      const avg = calculateTrimesterAverage(s.trimesters[currentTrimester]);
      return { name: s.name, average: avg, status: getStatus(avg), color: s.color };
    });
    const bestSubject = [...subjectsWithGrades].sort((a, b) => b.average - a.average)[0];
    return { subjectsWithGrades, bestSubject };
  }, [subjects, currentTrimester]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-4xl mb-8 animate-pulse shadow-2xl">📚</div>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Bons Estudos, {user?.name.split(' ')[0]}!</h2>
        <p className="text-slate-500 max-w-sm mt-4 leading-relaxed font-medium">Configure suas disciplinas para começar a organizar suas notas do {currentTrimester}º trimestre.</p>
        <div className="mt-8 flex space-x-4">
          <div className="px-4 py-2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase rounded-full">Disciplina</div>
          <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full">Excelência</div>
        </div>
      </div>
    );
  }

  const overallAvg = (stats?.subjectsWithGrades.reduce((a, b) => a + b.average, 0)! / subjects.length).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Gaspar Virtual</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Painel Acadêmico</h1>
          <p className="text-slate-500 font-medium mt-2 capitalize">{user?.name}, você já dedicou <span className="text-slate-900 font-bold">{formatTime(studySession.todaySeconds)}</span> aos estudos hoje.</p>
        </div>
        <div className="flex bg-white p-2 rounded-3xl border border-slate-200 shadow-sm items-center space-x-4 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-xl shadow-lg shadow-slate-900/20">🔥</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foco</p>
            <p className="text-lg font-black text-slate-900 leading-none">Média {overallAvg}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Média Atual" value={overallAvg} subText="Total do Trimestre" icon="📊" color="text-slate-900" />
        <MetricCard label="Foco Semanal" value={formatTime(studySession.totalSeconds)} subText="Tempo Acumulado" icon="⏱️" color="text-indigo-600" />
        <MetricCard label="Destaque" value={stats?.bestSubject?.name || '-'} subText={`Média: ${stats?.bestSubject?.average}`} icon="🌟" color="text-amber-600" />
        <MetricCard label="Calendário" value="12" subText="Atividades Pendentes" icon="📅" color="text-slate-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Desempenho por Disciplina</h3>
            <span className="bg-slate-50 text-[10px] font-black text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">{currentTrimester}º Trimestre</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.subjectsWithGrades}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="average" radius={[12, 12, 12, 12]} barSize={40}>
                  {stats?.subjectsWithGrades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-[0.2em] mb-10">Radar de Dedicação</h3>
          <div className="flex-1 space-y-8">
            {stats?.subjectsWithGrades.slice(0, 4).map((s, i) => (
               <FocusRow key={i} label={s.name} percent={Math.min(100, (s.average * 10))} color={s.color} />
            ))}
          </div>
          <button className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">Relatório Completo</button>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string, value: string, subText: string, icon: string, color: string }> = ({ label, value, subText, icon, color }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <span className="text-6xl">{icon}</span>
    </div>
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-sm shadow-inner">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase opacity-60 tracking-tighter">{subText}</p>
  </div>
);

const FocusRow: React.FC<{ label: string, percent: number, color: string }> = ({ label, percent, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
      <span>{label}</span>
      <span className="text-amber-400">{percent}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

export default Dashboard;
