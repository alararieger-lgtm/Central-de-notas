
import React, { useState } from 'react';
import { AppData, StudentRegistry, Subject } from '../types';
import SubjectDetail from './SubjectDetail';

interface Props {
  data: AppData;
  onUpdateRegistry: (registry: StudentRegistry[]) => void;
}

const TeacherDashboard: React.FC<Props> = ({ data, onUpdateRegistry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistry | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [currentTrimester, setCurrentTrimester] = useState<1 | 2 | 3>(data.currentTrimester);

  // Simulação de base de dados de alunos caso não exista
  const registry = data.studentsRegistry || [
    { id: '1', name: 'João Silva', grade: '1º Ano Médio', subjects: data.subjects },
    { id: '2', name: 'Maria Oliveira', grade: '1º Ano Médio', subjects: [] },
    { id: '3', name: 'Pedro Santos', grade: '9º Ano Fundamental', subjects: [] }
  ];

  const filteredStudents = registry.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStudentSubject = (updatedSubject: Subject) => {
    if (!selectedStudent) return;
    
    const updatedSubjects = selectedStudent.subjects.map(s => 
      s.id === updatedSubject.id ? updatedSubject : s
    );

    const updatedRegistry = registry.map(student => 
      student.id === selectedStudent.id ? { ...student, subjects: updatedSubjects } : student
    );

    onUpdateRegistry(updatedRegistry);
    setSelectedStudent({ ...selectedStudent, subjects: updatedSubjects });
    setActiveSubject(updatedSubject);
  };

  if (activeSubject && selectedStudent) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <div className="bg-amber-100 text-amber-800 p-4 rounded-2xl mb-6 flex items-center justify-between border border-amber-200">
          <span className="text-xs font-black uppercase tracking-widest">Lançando Notas para: <b>{selectedStudent.name}</b></span>
          <button onClick={() => setActiveSubject(null)} className="font-bold text-xs uppercase underline">Sair da Matéria</button>
        </div>
        <SubjectDetail 
          subject={activeSubject}
          currentTrimester={currentTrimester}
          onBack={() => setActiveSubject(null)}
          onUpdate={handleUpdateStudentSubject}
        />
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <header className="flex items-center justify-between">
          <button onClick={() => setSelectedStudent(null)} className="text-slate-400 font-bold flex items-center space-x-2">
            <span>← Voltar para Lista</span>
          </button>
          <div className="flex bg-slate-200 p-1 rounded-lg">
            {[1, 2, 3].map(t => (
              <button
                key={t}
                onClick={() => setCurrentTrimester(t as 1 | 2 | 3)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currentTrimester === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {t}º Trim
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center text-2xl font-black">
              {selectedStudent.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{selectedStudent.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.grade}</p>
            </div>
          </div>

          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Selecione a Disciplina para Lançar Notas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedStudent.subjects.length > 0 ? selectedStudent.subjects.map(subject => (
              <button 
                key={subject.id}
                onClick={() => setActiveSubject(subject)}
                className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-400 hover:bg-white transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                  <span className="font-bold text-slate-700">{subject.name}</span>
                </div>
                <span className="text-slate-300 group-hover:text-amber-500">✎</span>
              </button>
            )) : (
              <p className="text-sm text-slate-400 italic col-span-2 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Nenhuma disciplina vinculada a este aluno.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Área Docente</span>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestão Acadêmica</h1>
        <p className="text-slate-500 font-medium">Lançamento de notas e acompanhamento de turmas.</p>
      </header>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Buscar aluno por nome ou turma..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-slate-800 pr-12"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Série</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-[10px] text-slate-400 sm:hidden uppercase font-bold">{student.grade}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-bold text-slate-500 uppercase">{student.grade}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="bg-slate-900 text-amber-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Lançar Notas
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic text-sm">Nenhum aluno encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Dica de Produtividade</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">Você pode exportar a planilha de notas geral na aba de configurações para relatórios mensais.</p>
        </div>
        <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center text-xl">💡</div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
