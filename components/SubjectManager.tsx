
import React, { useState } from 'react';
import { Subject, TrimesterGrades } from '../types';
import SubjectDetail from './SubjectDetail';
// Import the utility function for calculating trimester averages
import { calculateTrimesterAverage } from '../gradeUtils';

interface Props {
  subjects: Subject[];
  updateSubjects: (s: Subject[]) => void;
  currentTrimester: 1 | 2 | 3;
  setTrimester: (t: 1 | 2 | 3) => void;
}

const COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#64748B'];

const SubjectManager: React.FC<Props> = ({ subjects, updateSubjects, currentTrimester, setTrimester }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const addSubject = () => {
    if (!newSubjectName.trim()) return;

    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      color: selectedColor,
      trimesters: {
        1: { av1: [], av2: [], pat: null },
        2: { av1: [], av2: [], pat: null },
        3: { av1: [], av2: [], pat: null }
      }
    };

    updateSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setIsAdding(false);
  };

  const removeSubject = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta matéria e todas as suas notas?')) {
      updateSubjects(subjects.filter(s => s.id !== id));
    }
  };

  if (activeSubject) {
    return (
      <SubjectDetail 
        subject={activeSubject} 
        onBack={() => setActiveSubject(null)}
        currentTrimester={currentTrimester}
        onUpdate={(updated) => {
          const newSubjects = subjects.map(s => s.id === updated.id ? updated : s);
          updateSubjects(newSubjects);
          setActiveSubject(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Minhas Matérias</h1>
          <p className="text-slate-500">Gerencie suas disciplinas e notas trimestrais.</p>
        </div>
        
        <div className="flex bg-slate-200 p-1 rounded-lg self-start">
          {[1, 2, 3].map(t => (
            <button
              key={t}
              onClick={() => setTrimester(t as 1 | 2 | 3)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${currentTrimester === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-500'}`}
            >
              {t}º Trim
            </button>
          ))}
        </div>
      </header>

      {isAdding ? (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-slate-800 mb-4">Nova Matéria</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome da Disciplina</label>
              <input 
                type="text" 
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                placeholder="Ex: Matemática, História..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Cor de Identificação</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === c ? 'scale-125 border-slate-900' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={addSubject}
                className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Salvar Matéria
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all font-bold flex items-center justify-center space-x-2"
        >
          <span>➕ Adicionar Nova Matéria</span>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <div 
            key={subject.id} 
            className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setActiveSubject(subject)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }}></div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{subject.name}</h3>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeSubject(subject.id); }}
                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
              >
                🗑️
              </button>
            </div>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Média Atual</p>
                <p className="text-2xl font-black text-slate-900">
                  {calculateTrimesterAverage(subject.trimesters[currentTrimester])}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Ver detalhes →</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManager;
