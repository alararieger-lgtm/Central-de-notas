
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const AUTHORIZED_TEACHERS = [
  'lara.rieger@gmail.com',
  'coordenacao.gaspar@gmail.com',
  'professor.exemplo@gmail.com'
];

const AVAILABLE_SUBJECTS = [
  { id: 'mat', name: 'Matemática' },
  { id: 'por', name: 'Português' },
  { id: 'his', name: 'História' },
  { id: 'geo', name: 'Geografia' },
  { id: 'cie', name: 'Ciências' },
  { id: 'fis', name: 'Física' },
  { id: 'qui', name: 'Química' },
  { id: 'ing', name: 'Inglês' },
  { id: 'art', name: 'Artes' },
  { id: 'edf', name: 'Educação Física' }
];

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('1º Ano Médio');
  const [step, setStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'student') {
      onLogin({ name, grade, role: 'student' });
    } else {
      if (AUTHORIZED_TEACHERS.includes(email.toLowerCase())) {
        setStep(2);
      } else {
        setError('E-mail não autorizado para acesso docente.');
      }
    }
  };

  const handleTeacherComplete = () => {
    if (selectedSubjects.length === 0) {
      setError('Selecione ao menos uma disciplina.');
      return;
    }
    onLogin({ 
      name: name || 'Professor(a)', 
      grade: 'Corpo Docente', 
      role: 'teacher',
      email: email.toLowerCase(),
      assignedSubjects: selectedSubjects
    });
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (step === 2 && role === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Suas Disciplinas</h2>
          <p className="text-slate-500 text-sm mb-6">Quais matérias você leciona no Colégio Gaspar?</p>
          
          <div className="grid grid-cols-2 gap-2 mb-8 max-h-60 overflow-y-auto pr-2">
            {AVAILABLE_SUBJECTS.map(sub => (
              <button
                key={sub.id}
                onClick={() => toggleSubject(sub.id)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border-2 ${selectedSubjects.includes(sub.id) ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {error && <p className="text-rose-500 text-[10px] font-bold mb-4 uppercase">{error}</p>}

          <button 
            onClick={handleTeacherComplete}
            className="w-full bg-amber-400 text-slate-900 font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
          >
            Concluir Cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden relative border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
            <span className="text-2xl text-amber-400 font-black tracking-tighter">CG</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Portal Colégio Gaspar</h1>
          
          <div className="flex bg-slate-100 p-1 rounded-xl mt-6">
            <button 
              onClick={() => { setRole('student'); setError(''); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              Sou Aluno
            </button>
            <button 
              onClick={() => { setRole('teacher'); setError(''); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${role === 'teacher' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-400'}`}
            >
              Sou Professor
            </button>
          </div>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-bold text-center animate-bounce">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-800"
              placeholder="Ex: João Silva"
            />
          </div>

          {role === 'teacher' ? (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gmail Autorizado</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-800"
                placeholder="seu-email@gmail.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Série / Turma</label>
              <select 
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-800"
              >
                <optgroup label="Ensino Médio">
                  <option>1º Ano Médio</option>
                  <option>2º Ano Médio</option>
                  <option>3º Ano Médio</option>
                </optgroup>
                <optgroup label="Ensino Fundamental">
                  <option>6º Ano Fundamental</option>
                  <option>7º Ano Fundamental</option>
                  <option>8º Ano Fundamental</option>
                  <option>9º Ano Fundamental</option>
                </optgroup>
              </select>
            </div>
          )}
          
          <button 
            type="submit"
            className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-4 text-xs ${role === 'teacher' ? 'bg-amber-400 text-slate-900 shadow-amber-400/20' : 'bg-slate-900 text-amber-400 shadow-slate-900/20'}`}
          >
            {role === 'teacher' ? 'Continuar' : 'Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
