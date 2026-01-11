
import React, { useState, useEffect, useRef } from 'react';
import { AppData, StudySession, StudyGroup, ChatMessage } from '../types';

interface Props {
  data: AppData;
  onUpdateSession: (s: StudySession) => void;
  onUpdateGroups: (g: StudyGroup[]) => void;
}

const StudyCenter: React.FC<Props> = ({ data, onUpdateSession, onUpdateGroups }) => {
  const [activeMode, setActiveMode] = useState<'timer' | 'groups'>('timer');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ 
    name: '', 
    desc: '', 
    privacy: 'public' as 'public' | 'private' 
  });

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      const newSession = { ...data.studySession };
      newSession.totalSeconds += seconds;
      newSession.todaySeconds += seconds;
      onUpdateSession(newSession);
      setSeconds(0);
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const createGroup = () => {
    if (!newGroupData.name.trim()) return;
    const newGroup: StudyGroup = {
      id: 'custom-' + Date.now(),
      name: newGroupData.name,
      membersCount: 1,
      description: newGroupData.desc,
      category: 'Extra',
      privacy: newGroupData.privacy,
      messages: []
    };
    onUpdateGroups([...data.studyGroups, newGroup]);
    setIsCreatingGroup(false);
    setNewGroupData({ name: '', desc: '', privacy: 'public' });
  };

  const activeGroup = data.studyGroups.find(g => g.id === activeGroupId);

  const sendMessage = () => {
    if (!msgInput.trim() || !activeGroupId || !data.user) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: data.user.name.split(' ')[0],
      text: msgInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    const updatedGroups = data.studyGroups.map(g => 
      g.id === activeGroupId ? { ...g, messages: [...g.messages, newMessage] } : g
    );
    onUpdateGroups(updatedGroups);
    setMsgInput('');
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Estudo</h1>
          <p className="text-slate-500 font-medium">Foco e colaboração Gaspar.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          <button 
            onClick={() => setActiveMode('timer')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'timer' ? 'bg-slate-900 text-amber-400' : 'text-slate-400'}`}
          >
            Foco
          </button>
          <button 
            onClick={() => setActiveMode('groups')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'groups' ? 'bg-slate-900 text-amber-400' : 'text-slate-400'}`}
          >
            Grupos
          </button>
        </div>
      </header>

      {activeMode === 'timer' ? (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border-[10px] border-slate-50 flex items-center justify-center mb-8 relative">
              <div className={`absolute inset-0 rounded-full border-[10px] border-amber-400 border-t-transparent ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}></div>
              <span className="text-5xl md:text-6xl font-mono font-black text-slate-900 tracking-tighter">{formatTime(seconds || data.studySession.todaySeconds)}</span>
            </div>
            
            <button 
              onClick={toggleTimer}
              className={`w-full max-w-xs py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all transform active:scale-90 shadow-2xl ${isRunning ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-slate-900 text-amber-400 shadow-slate-900/40'}`}
            >
              {isRunning ? 'Pausar' : 'Começar'}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatBox label="Hoje" value={formatTime(data.studySession.todaySeconds)} icon="📅" />
            <StatBox label="Total" value={formatTime(data.studySession.totalSeconds)} icon="🌍" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 h-[calc(100vh-250px)] min-h-[500px]">
          {/* List of groups */}
          <div className={`${activeGroupId && 'hidden lg:flex'} bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden flex flex-col shadow-sm`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Grupos</h3>
              <button 
                onClick={() => setIsCreatingGroup(true)} 
                className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-90 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {data.studyGroups.map(group => (
                <button 
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${activeGroupId === group.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{group.category}</p>
                    <span className="text-[10px] opacity-70">
                      {group.privacy === 'private' ? '🔒' : '🌐'}
                    </span>
                  </div>
                  <span className="font-bold block text-sm leading-tight">{group.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!activeGroupId && 'hidden lg:flex'} lg:col-span-3 bg-white rounded-[1.5rem] border border-slate-200 flex flex-col shadow-sm overflow-hidden`}>
            {activeGroup ? (
              <>
                <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
                  <button onClick={() => setActiveGroupId(null)} className="lg:hidden text-indigo-600 font-bold p-2">←</button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm truncate">{activeGroup.name}</h2>
                      <span className="text-xs">{activeGroup.privacy === 'private' ? '🔒' : '🌐'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{activeGroup.privacy === 'private' ? 'Grupo Privado' : 'Comunidade Pública'} • {activeGroup.membersCount} Membros</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                  {activeGroup.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                      <span className="text-4xl mb-4">💬</span>
                      <p className="text-xs font-bold uppercase tracking-widest">Inicie a conversa!</p>
                    </div>
                  )}
                  {activeGroup.messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {!msg.isMe && <span className="text-[8px] font-black text-slate-400 uppercase mb-1 ml-2">{msg.sender}</span>}
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${msg.isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-300 mt-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Mensagem..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                  <button onClick={sendMessage} className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-slate-900/10">🚀</button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-3xl">🤝</div>
                <p className="text-sm font-black uppercase tracking-widest">Escolha um grupo para colaborar</p>
                <p className="text-xs mt-2 max-w-xs text-slate-400">Tire dúvidas, compartilhe resumos e foque nos objetivos com seus colegas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Criar Novo Grupo</h2>
            <p className="text-slate-500 text-sm mb-6">Colabore com seus colegas do Colégio Gaspar.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome do Grupo</label>
                <input 
                  type="text" 
                  value={newGroupData.name}
                  onChange={e => setNewGroupData({...newGroupData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-800"
                  placeholder="Ex: Foco no ENEM, Turma 101..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Privacidade</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setNewGroupData({...newGroupData, privacy: 'public'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${newGroupData.privacy === 'public' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    <span className="text-xl mb-1">🌐</span>
                    <span className="text-[10px] font-black uppercase">Público</span>
                  </button>
                  <button 
                    onClick={() => setNewGroupData({...newGroupData, privacy: 'private'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${newGroupData.privacy === 'private' ? 'bg-rose-50 border-rose-600 text-rose-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    <span className="text-xl mb-1">🔒</span>
                    <span className="text-[10px] font-black uppercase">Privado</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Descrição (Opcional)</label>
                <textarea 
                  value={newGroupData.desc}
                  onChange={e => setNewGroupData({...newGroupData, desc: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-700 h-24 resize-none"
                  placeholder="Sobre o que é este grupo?"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setIsCreatingGroup(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={createGroup}
                  disabled={!newGroupData.name.trim()}
                  className="flex-1 py-4 bg-slate-900 text-amber-400 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  Criar Grupo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center md:items-start">
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-sm">{icon}</span>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

export default StudyCenter;
