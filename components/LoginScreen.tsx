
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface Props {
  onLogin: (user: UserProfile) => void;
}

// Lista de e-mails autorizados (Você poderá editar aqui depois)
const AUTHORIZED_TEACHERS = [
  'lara.rieger@gmail.com',
  'coordenacao.gaspar@gmail.com',
  'professor.exemplo@gmail.com'
];

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('1º Ano Médio');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'student') {
      if (name.trim()) {
        onLogin({ name, grade, role: 'student' });
      }
    } else {
      // Validação do Professor
      if (AUTHORIZED_TEACHERS.includes(email.toLowerCase())) {
        onLogin({ 
          name: name || 'Professor(a)', 
          grade: 'Corpo Docente', 
          role: 'teacher',
          email: email.toLowerCase() 
        });
      } else {
        setError('E-mail não autorizado para acesso docente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden relative border border-white/10">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-bold text-center animate-bounce">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              {role === 'student' ? 'Nome Completo' : 'Seu Nome'}
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium text-slate-800"
              placeholder={role === 'student' ? "Ex: João Silva" : "Nome do Docente"}
            />
          </div>

          {role === 'teacher' ? (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">E-mail Institucional (Gmail)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium text-slate-800"
                placeholder="seu-email@gmail.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Série / Turma</label>
              <div className="relative">
                <select 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium appearance-none text-slate-800"
                >
                  <optgroup label="Ensino Fundamental">
                    <option>6º Ano Fundamental</option>
                    <option>7º Ano Fundamental</option>
                    <option>8º Ano Fundamental</option>
                    <option>9º Ano Fundamental</option>
                  </optgroup>
                  <optgroup label="Ensino Médio">
                    <option>1º Ano Médio</option>
                    <option>2º Ano Médio</option>
                    <option>3º Ano Médio</option>
                  </optgroup>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">↓</div>
              </div>
            </div>
          )}
          
          <button 
            type="submit"
            className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-4 text-xs ${role === 'teacher' ? 'bg-amber-400 text-slate-900 shadow-amber-400/20' : 'bg-slate-900 text-amber-400 shadow-slate-900/20'}`}
          >
            Acessar Sistema
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Colégio Gaspar - Venâncio Aires</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
