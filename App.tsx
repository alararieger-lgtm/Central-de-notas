
import React, { useState, useEffect } from 'react';
import { AppData, UserProfile, StudyGroup, StudentRegistry, AssessmentRecord } from './types';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import StudyCenter from './components/StudyCenter';
import LoginScreen from './components/LoginScreen';
import TeacherDashboard from './components/TeacherDashboard';

const STORAGE_KEY = 'gaspar_app_v2';

const OFFICIAL_GROUPS: StudyGroup[] = [
  { id: 'f6', name: '6º Ano - Fundamental', membersCount: 45, description: 'Grupo oficial do 6º ano Colégio Gaspar.', isOfficial: true, category: 'Fundamental', messages: [], privacy: 'public' },
  { id: 'f7', name: '7º Ano - Fundamental', membersCount: 42, description: 'Grupo oficial do 7º ano Colégio Gaspar.', isOfficial: true, category: 'Fundamental', messages: [], privacy: 'public' },
  { id: 'f8', name: '8º Ano - Fundamental', membersCount: 38, description: 'Grupo oficial do 8º ano Colégio Gaspar.', isOfficial: true, category: 'Fundamental', messages: [], privacy: 'public' },
  { id: 'f9', name: '9º Ano - Fundamental', membersCount: 50, description: 'Grupo oficial do 9º ano Colégio Gaspar.', isOfficial: true, category: 'Fundamental', messages: [], privacy: 'public' },
  { id: 'm1', name: '1º Ano - Médio', membersCount: 60, description: 'Preparação e foco no Ensino Médio.', isOfficial: true, category: 'Médio', messages: [], privacy: 'public' },
  { id: 'm2', name: '2º Ano - Médio', membersCount: 55, description: 'Consolidação de conhecimento.', isOfficial: true, category: 'Médio', messages: [], privacy: 'public' },
  { id: 'm3', name: '3º Ano - Médio', membersCount: 72, description: 'Foco total em Vestibular e ENEM.', isOfficial: true, category: 'Médio', messages: [], privacy: 'public' },
];

const INITIAL_SUBJECTS = [
  { id: 'mat', name: 'Matemática', color: '#6366F1', trimesters: { 1: {av1: [], av2: [], pat: null}, 2: {av1: [], av2: [], pat: null}, 3: {av1: [], av2: [], pat: null} } },
  { id: 'por', name: 'Português', color: '#EC4899', trimesters: { 1: {av1: [], av2: [], pat: null}, 2: {av1: [], av2: [], pat: null}, 3: {av1: [], av2: [], pat: null} } },
  { id: 'his', name: 'História', color: '#F59E0B', trimesters: { 1: {av1: [], av2: [], pat: null}, 2: {av1: [], av2: [], pat: null}, 3: {av1: [], av2: [], pat: null} } },
  { id: 'geo', name: 'Geografia', color: '#10B981', trimesters: { 1: {av1: [], av2: [], pat: null}, 2: {av1: [], av2: [], pat: null}, 3: {av1: [], av2: [], pat: null} } }
];

const MOCK_REGISTRY: StudentRegistry[] = [
  { id: '1', name: 'Lara Rieger', grade: '1º Ano Médio', subjects: INITIAL_SUBJECTS },
  { id: '2', name: 'Arthur Santos', grade: '1º Ano Médio', subjects: INITIAL_SUBJECTS },
  { id: '3', name: 'Beatriz Lima', grade: '1º Ano Médio', subjects: INITIAL_SUBJECTS },
  { id: '4', name: 'Lucas Ferreira', grade: '9º Ano Fundamental', subjects: INITIAL_SUBJECTS }
];

const INITIAL_DATA: AppData = {
  user: null,
  subjects: INITIAL_SUBJECTS,
  calendar: [],
  currentTrimester: 1,
  studySession: {
    totalSeconds: 0,
    todaySeconds: 0,
    lastStudyDate: new Date().toISOString().split('T')[0]
  },
  studyGroups: OFFICIAL_GROUPS,
  studentsRegistry: MOCK_REGISTRY
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'calendar' | 'focus' | 'settings' | 'admin'>('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.studySession && parsed.studySession.lastStudyDate !== today) {
          parsed.studySession.todaySeconds = 0;
          parsed.studySession.lastStudyDate = today;
        }
        // Garantir que os dados básicos existam se o save for de versão anterior
        parsed.studentsRegistry = parsed.studentsRegistry || MOCK_REGISTRY;
        parsed.subjects = parsed.subjects || INITIAL_SUBJECTS;
        
        setData(parsed);
        if (parsed.user?.role === 'teacher') setActiveTab('admin');
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleLogin = (user: UserProfile) => {
    // Se for aluno, tentamos buscar ele no registro ou criar novo
    if (user.role === 'student') {
      const existing = data.studentsRegistry.find(s => s.name === user.name && s.grade === user.grade);
      if (existing) {
        setData(prev => ({ ...prev, user, subjects: existing.subjects }));
      } else {
        const newRegistry: StudentRegistry = { id: Date.now().toString(), name: user.name, grade: user.grade, subjects: INITIAL_SUBJECTS };
        setData(prev => ({ ...prev, user, subjects: INITIAL_SUBJECTS, studentsRegistry: [...prev.studentsRegistry, newRegistry] }));
      }
      setActiveTab('dashboard');
    } else {
      setData(prev => ({ ...prev, user }));
      setActiveTab('admin');
    }
  };

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  if (!data.user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const isTeacher = data.user.role === 'teacher';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-all duration-300">
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-slate-900 text-white fixed h-full left-0 top-0 z-40 border-r border-slate-800">
        <div className="p-6 flex flex-col items-center lg:items-start border-b border-white/5">
          <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-400/20 text-slate-900 font-bold">CG</div>
          <h1 className="hidden lg:block text-xs font-black uppercase tracking-[0.2em] text-amber-400">Colégio Gaspar</h1>
          <p className="hidden lg:block text-[10px] text-slate-400 font-medium mt-1 uppercase">Portal {isTeacher ? 'Docente' : 'do Aluno'}</p>
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2">
          {isTeacher && <NavItem active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon="🔑" label="Gerenciar" />}
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" label="Painel" />
          <NavItem active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon="📚" label="Notas" />
          {!isTeacher && <NavItem active={activeTab === 'focus'} onClick={() => setActiveTab('focus')} icon="⏱️" label="Estudo" />}
          <NavItem active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon="📅" label="Agenda" />
          <div className="pt-4 border-t border-white/5 mt-4">
            <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="⚙️" label="Perfil" />
          </div>
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex justify-around p-2 z-50 safe-bottom">
        {isTeacher && <MobileNavItem active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon="🔑" label="Gestão" />}
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" label="Início" />
        <MobileNavItem active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon="📚" label="Notas" />
        {!isTeacher && <MobileNavItem active={activeTab === 'focus'} onClick={() => setActiveTab('focus')} icon="⏱️" label="Estudo" />}
        <MobileNavItem active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon="📅" label="Agenda" />
        <MobileNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="👤" label="Perfil" />
      </nav>

      <main className="flex-1 p-4 md:p-8 md:pl-28 lg:pl-72 max-w-7xl mx-auto w-full pb-28 md:pb-8">
        <div className="animate-in fade-in duration-500">
          {activeTab === 'admin' && isTeacher && (
            <TeacherDashboard 
              data={data} 
              onUpdateRegistry={(reg) => {
                updateData({ studentsRegistry: reg });
                // Se o usuário atual for aluno, atualizamos as matérias dele na visão dele também
                if (data.user?.role === 'student') {
                  const meInReg = reg.find(s => s.name === data.user?.name);
                  if (meInReg) updateData({ subjects: meInReg.subjects });
                }
              }}
              onUpdateCalendar={(events) => updateData({ calendar: events })}
            />
          )}
          {activeTab === 'dashboard' && <Dashboard data={data} />}
          {activeTab === 'subjects' && (
            <SubjectManager 
              subjects={data.subjects} 
              updateSubjects={(s) => {
                updateData({ subjects: s });
                // Atualizar no registro global de alunos
                const newReg = data.studentsRegistry.map(sr => sr.name === data.user?.name ? {...sr, subjects: s} : sr);
                updateData({ studentsRegistry: newReg });
              }} 
              currentTrimester={data.currentTrimester}
              setTrimester={(t) => updateData({ currentTrimester: t })}
            />
          )}
          {activeTab === 'focus' && !isTeacher && (
            <StudyCenter data={data} onUpdateSession={(s) => updateData({ studySession: s })} onUpdateGroups={(g) => updateData({ studyGroups: g })} />
          )}
          {activeTab === 'calendar' && (
            <Calendar 
              events={data.calendar.filter(e => !isTeacher ? (e.targetGrade === data.user?.grade || !e.targetGrade) : true)} 
              subjects={data.subjects}
              addEvent={(e) => updateData({ calendar: [...data.calendar, e] })}
              removeEvent={(id) => updateData({ calendar: data.calendar.filter(ev => ev.id !== id) })}
              // Pass current user grade to populate targetGrade when student adds an event
              userGrade={data.user?.grade}
            />
          )}
          {activeTab === 'settings' && <Settings data={data} onImport={setData} onLogout={() => updateData({ user: null })} />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-3 py-4 rounded-xl transition-all ${active ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
    <span className="text-xl">{icon}</span>
    <span className="hidden lg:block font-bold text-sm">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <span className="text-xl mb-0.5">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
