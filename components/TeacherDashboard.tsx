
import React, { useState } from 'react';
import { AppData, StudentRegistry, Subject, AssessmentRecord, AssessmentType } from '../types';
import SubjectDetail from './SubjectDetail';

interface Props {
  data: AppData;
  onUpdateRegistry: (registry: StudentRegistry[]) => void;
  onUpdateCalendar: (events: AssessmentRecord[]) => void;
}

const GRADES = [
  '6º Ano Fundamental', '7º Ano Fundamental', '8º Ano Fundamental', '9º Ano Fundamental',
  '1º Ano Médio', '2º Ano Médio', '3º Ano Médio'
];

const TeacherDashboard: React.FC<Props> = ({ data, onUpdateRegistry, onUpdateCalendar }) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [view, setView] = useState<'menu' | 'grades' | 'calendar' | 'announcement'>('menu');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistry | null>(null);
  const [eventForm, setEventForm] = useState({ type: 'AV1' as AssessmentType, date: '', content: '' });

  // Minhas matérias baseadas no que escolhi no login
  const mySubjects = data.user?.assignedSubjects || [];
  const subjectsObjects = data.subjects.filter(s => mySubjects.includes(s.id));

  // Simulação de alunos para a turma selecionada
  const students = data.studentsRegistry.filter(s => s.grade === selectedGrade);

  const activeSubject = subjectsObjects.find(s => s.id === selectedSubjectId);

  const handleUpdateStudentSubject = (updatedSubject: Subject) => {
    if (!selectedStudent) return;
    const updatedRegistry = data.studentsRegistry.map(student => {
      if (student.id === selectedStudent.id) {
        const updatedSubjects = student.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        return { ...student, subjects: updatedSubjects };
      }
      return student;
    });
    onUpdateRegistry(updatedRegistry);
    setSelectedStudent(prev => prev ? { ...prev, subjects: prev.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s) } : null);
  };

  const createEvent = () => {
    if (!selectedGrade || !selectedSubjectId || !eventForm.date) return;
    const newEvent: AssessmentRecord = {
      id: Date.now().toString(),
      subjectId: selectedSubjectId,
      subjectName: activeSubject?.name,
      type: eventForm.type,
      date: eventForm.date,
      content: eventForm.content,
      grade: 0,
      targetGrade: selectedGrade,
      teacherId: data.user?.email
    };
    onUpdateCalendar([...data.calendar, newEvent]);
    setView('menu');
    setEventForm({ type: 'AV1', date: '', content: '' });
  };

  // Se estiver lançando notas para um aluno específico
  if (selectedStudent && activeSubject) {
    const studentSpecificSubject = selectedStudent.subjects.find(s => s.id === activeSubject.id) || activeSubject;
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <div className="bg-amber-100 text-amber-800 p-4 rounded-2xl mb-6 flex items-center justify-between border border-amber-200">
          <span className="text-xs font-black uppercase tracking-widest">Lançando em <b>{activeSubject.name}</b> para: <b>{selectedStudent.name}</b></span>
          <button onClick={() => setSelectedStudent(null)} className="font-bold text-xs uppercase underline">Voltar</button>
        </div>
        <SubjectDetail 
          subject={studentSpecificSubject}
          currentTrimester={data.currentTrimester}
          onBack={() => setSelectedStudent(null)}
          onUpdate={handleUpdateStudentSubject}
        />
      </div>
    );
  }

  // Se não escolheu turma ou matéria ainda
  if (!selectedGrade || !selectedSubjectId) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Minhas Turmas</h1>
          <p className="text-slate-500 font-medium">Selecione uma turma e disciplina para gerenciar.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">1. Selecione a Turma</h3>
            <div className="grid grid-cols-1 gap-2">
              {GRADES.map(g => (
                <button 
                  key={g} 
                  onClick={() => setSelectedGrade(g)}
                  className={`text-left p-4 rounded-xl font-bold text-sm transition-all ${selectedGrade === g ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">2. Selecione a Disciplina</h3>
            <div className="grid grid-cols-1 gap-2">
              {subjectsObjects.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSelectedSubjectId(s.id)}
                  className={`text-left p-4 rounded-xl font-bold text-sm transition-all flex items-center space-x-3 ${selectedSubjectId === s.id ? 'bg-amber-400 text-slate-900' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => { setSelectedGrade(null); setSelectedSubjectId(null); setView('menu'); }} className="text-xs font-bold text-indigo-600 uppercase mb-1">← Mudar Turma/Disciplina</button>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedGrade}</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSubject?.color }}></div>
            <p className="text-sm font-bold text-slate-500 uppercase">{activeSubject?.name}</p>
          </div>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button onClick={() => setView('menu')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${view === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Início</button>
          <button onClick={() => setView('grades')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${view === 'grades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Notas</button>
          <button onClick={() => setView('calendar')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${view === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Agenda</button>
        </div>
      </header>

      {view === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard title="Lançar Notas" icon="📝" onClick={() => setView('grades')} color="bg-indigo-50 text-indigo-600" />
          <ActionCard title="Agendar Prova" icon="📅" onClick={() => setView('calendar')} color="bg-amber-50 text-amber-600" />
          <ActionCard title="Enviar Aviso" icon="📣" onClick={() => setView('announcement')} color="bg-emerald-50 text-emerald-600" />
        </div>
      )}

      {view === 'grades' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{s.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedStudent(s)} className="bg-slate-900 text-amber-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">Ver Boletim</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm max-w-xl mx-auto">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-6">Novo Evento na Agenda</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
              <div className="flex gap-2">
                {['AV1', 'AV2', 'PAT', 'TRABALHO'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setEventForm({...eventForm, type: t as AssessmentType})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${eventForm.type === t ? 'bg-slate-900 text-amber-400 shadow-md' : 'bg-slate-50 text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data</label>
              <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-slate-800" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Conteúdo Programático</label>
              <textarea 
                value={eventForm.content} 
                onChange={e => setEventForm({...eventForm, content: e.target.value})} 
                placeholder="O que será cobrado?"
                className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium text-slate-700 h-32 resize-none"
              />
            </div>
            <button onClick={createEvent} className="w-full bg-slate-900 text-amber-400 font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl">Confirmar Agendamento</button>
          </div>
        </div>
      )}

      {view === 'announcement' && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm max-w-xl mx-auto">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-6">Enviar Aviso para a Turma</h3>
          <div className="space-y-4">
            <textarea 
              placeholder="Digite aqui o comunicado importante..."
              className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium text-slate-700 h-40 resize-none"
              onChange={e => setEventForm({...eventForm, content: e.target.value})}
            ></textarea>
            <button 
              onClick={() => {
                const newAviso: AssessmentRecord = {
                  id: Date.now().toString(),
                  subjectId: selectedSubjectId!,
                  subjectName: activeSubject?.name,
                  type: 'AVISO',
                  date: new Date().toISOString().split('T')[0],
                  content: eventForm.content,
                  grade: 0,
                  targetGrade: selectedGrade!
                };
                onUpdateCalendar([...data.calendar, newAviso]);
                setView('menu');
              }}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-emerald-600/20"
            >
              Publicar Aviso 📣
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionCard: React.FC<{ title: string, icon: string, onClick: () => void, color: string }> = ({ title, icon, onClick, color }) => (
  <button onClick={onClick} className={`p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 shadow-sm border border-slate-100 ${color}`}>
    <span className="text-4xl mb-4">{icon}</span>
    <span className="font-black uppercase tracking-widest text-xs">{title}</span>
  </button>
);

export default TeacherDashboard;
