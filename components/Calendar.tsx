import React, { useState } from 'react';
import { AssessmentRecord, Subject, AssessmentType } from '../types';

interface Props {
  events: AssessmentRecord[];
  subjects: Subject[];
  addEvent: (e: AssessmentRecord) => void;
  removeEvent: (id: string) => void;
  // User's current grade to automatically set as targetGrade for new events
  userGrade?: string;
}

const Calendar: React.FC<Props> = ({ events, subjects, addEvent, removeEvent, userGrade }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    subjectId: '',
    type: 'AV1' as AssessmentType,
    date: new Date().toISOString().split('T')[0],
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.subjectId) return;

    // Find the subject to include its name in the record
    const subject = subjects.find(s => s.id === newEvent.subjectId);

    // Fix: targetGrade is required in AssessmentRecord (1-based line 25 fix)
    addEvent({
      id: Date.now().toString(),
      subjectId: newEvent.subjectId,
      subjectName: subject?.name,
      type: newEvent.type,
      date: newEvent.date,
      content: newEvent.content,
      grade: 0,
      targetGrade: userGrade || ''
    });
    setIsAdding(false);
    setNewEvent({ ...newEvent, content: '' });
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingEvents = sortedEvents.filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0));
  const pastEvents = sortedEvents.filter(e => new Date(e.date).getTime() < new Date().setHours(0,0,0,0)).reverse();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendário Acadêmico</h1>
          <p className="text-slate-500">Organize suas provas e entregas de trabalhos.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Novo Evento
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-xl fixed inset-4 md:inset-auto md:w-[400px] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50">
          <h2 className="text-xl font-black text-slate-800 mb-4">Agendar Avaliação</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Matéria</label>
              <select 
                value={newEvent.subjectId}
                onChange={e => setNewEvent({ ...newEvent, subjectId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Selecione a matéria</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
                <select 
                  value={newEvent.type}
                  onChange={e => setNewEvent({ ...newEvent, type: e.target.value as AssessmentType })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AV1">AV1 (Prova)</option>
                  <option value="AV2">AV2 (Trabalho)</option>
                  <option value="PAT">PAT (Trimestral)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
                <input 
                  type="date"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Conteúdo</label>
              <textarea 
                value={newEvent.content}
                onChange={e => setNewEvent({ ...newEvent, content: e.target.value })}
                placeholder="O que vai cair?"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-lg hover:bg-slate-200">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {isAdding && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAdding(false)}></div>}

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center">
            <span className="bg-indigo-600 w-2 h-6 rounded-full mr-2"></span>
            Próximas Avaliações
          </h2>
          <div className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-slate-400 bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center">Tudo tranquilo! Nenhuma avaliação agendada.</p>}
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} subjects={subjects} onRemove={removeEvent} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-400 mb-4 flex items-center">
            <span className="bg-slate-300 w-2 h-6 rounded-full mr-2"></span>
            Avaliações Passadas
          </h2>
          <div className="space-y-3 opacity-60">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} subjects={subjects} onRemove={removeEvent} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: AssessmentRecord, subjects: Subject[], onRemove: (id: string) => void }> = ({ event, subjects, onRemove }) => {
  const subject = subjects.find(s => s.id === event.subjectId);
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center justify-center bg-slate-50 w-16 h-16 rounded-lg border border-slate-100">
           <span className="text-xs font-black text-indigo-600 uppercase">{dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
           <span className="text-2xl font-black text-slate-800">{dateObj.getDate() + 1}</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-slate-800">{subject?.name || 'Matéria Removida'}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${event.type === 'PAT' ? 'bg-amber-100 text-amber-600' : event.type === 'AV1' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {event.type}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-md line-clamp-1">{event.content || 'Sem detalhes do conteúdo.'}</p>
        </div>
      </div>
      <button 
        onClick={() => onRemove(event.id)}
        className="text-slate-300 hover:text-rose-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
      >
        🗑️
      </button>
    </div>
  );
};

export default Calendar;