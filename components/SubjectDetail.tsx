
import React from 'react';
import { Subject, TrimesterGrades } from '../types';
import { calculateTrimesterAverage, getStatus, getStatusColor } from '../gradeUtils';

interface Props {
  subject: Subject;
  onBack: () => void;
  onUpdate: (s: Subject) => void;
  currentTrimester: 1 | 2 | 3;
}

const SubjectDetail: React.FC<Props> = ({ subject, onBack, onUpdate, currentTrimester }) => {
  const currentGrades = subject.trimesters[currentTrimester];
  const average = calculateTrimesterAverage(currentGrades);
  const status = getStatus(average);

  const updateGrade = (type: 'av1' | 'av2', index: number, value: string) => {
    const numValue = Math.min(10, Math.max(0, parseFloat(value) || 0));
    const newGrades = { ...currentGrades };
    newGrades[type] = [...newGrades[type]];
    newGrades[type][index] = numValue;

    const newSubject = { ...subject };
    newSubject.trimesters[currentTrimester] = newGrades;
    onUpdate(newSubject);
  };

  const addActivity = (type: 'av1' | 'av2') => {
    const newGrades = { ...currentGrades };
    newGrades[type] = [...newGrades[type], 0];
    const newSubject = { ...subject };
    newSubject.trimesters[currentTrimester] = newGrades;
    onUpdate(newSubject);
  };

  const removeActivity = (type: 'av1' | 'av2', index: number) => {
    const newGrades = { ...currentGrades };
    newGrades[type] = newGrades[type].filter((_, i) => i !== index);
    const newSubject = { ...subject };
    newSubject.trimesters[currentTrimester] = newGrades;
    onUpdate(newSubject);
  };

  const setPatGrade = (value: string) => {
    const numValue = value === '' ? null : Math.min(10, Math.max(0, parseFloat(value) || 0));
    const newGrades = { ...currentGrades, pat: numValue };
    const newSubject = { ...subject };
    newSubject.trimesters[currentTrimester] = newGrades;
    onUpdate(newSubject);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <button 
        onClick={onBack}
        className="text-slate-500 hover:text-indigo-600 font-bold flex items-center space-x-2 transition-colors mb-4"
      >
        <span>← Voltar para Matérias</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 text-white" style={{ backgroundColor: subject.color }}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black">{subject.name}</h2>
            <div className="text-right">
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">{currentTrimester}º Trimestre</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Média Final</p>
              <p className="text-4xl font-black text-slate-900">{average}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold border text-sm ${getStatusColor(status)}`}>
              {status}
            </div>
          </div>

          {/* AV1 Section */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-xs mr-2">AV1</span>
                Avaliação 1 (Peso 5)
              </h3>
              <button 
                onClick={() => addActivity('av1')}
                className="text-indigo-600 font-bold text-xs hover:underline"
              >
                + Adicionar Atividade
              </button>
            </div>
            <div className="space-y-3">
              {currentGrades.av1.length === 0 && <p className="text-slate-400 text-sm italic">Nenhuma nota registrada.</p>}
              {currentGrades.av1.map((grade, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-400 w-12">Ativ. {idx + 1}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={grade}
                    onChange={(e) => updateGrade('av1', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
                  />
                  <button onClick={() => removeActivity('av1', idx)} className="text-slate-300 hover:text-rose-500">✕</button>
                </div>
              ))}
            </div>
          </section>

          {/* AV2 Section */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 flex items-center">
                <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-xs mr-2">AV2</span>
                Trabalhos (Peso 2)
              </h3>
              <button 
                onClick={() => addActivity('av2')}
                className="text-emerald-600 font-bold text-xs hover:underline"
              >
                + Adicionar Trabalho
              </button>
            </div>
            <div className="space-y-3">
              {currentGrades.av2.length === 0 && <p className="text-slate-400 text-sm italic">Nenhuma nota registrada.</p>}
              {currentGrades.av2.map((grade, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-400 w-12">Tab. {idx + 1}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={grade}
                    onChange={(e) => updateGrade('av2', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold"
                  />
                  <button onClick={() => removeActivity('av2', idx)} className="text-slate-300 hover:text-rose-500">✕</button>
                </div>
              ))}
            </div>
          </section>

          {/* PAT Section */}
          <section>
            <h3 className="font-bold text-slate-800 flex items-center mb-3">
              <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs mr-2">PAT</span>
              Programa de Avaliação Trimestral (Peso 3)
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-400 w-12">Prova</span>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="10"
                value={currentGrades.pat ?? ''}
                onChange={(e) => setPatGrade(e.target.value)}
                placeholder="Nota PAT"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-center font-bold"
              />
              <div className="w-4"></div>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              * O cálculo é feito automaticamente: ((PAT × 3) + (Média AV1 × 5) + (Média AV2 × 2)) / 10. <br/>
              A média para aprovação é 7.0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
