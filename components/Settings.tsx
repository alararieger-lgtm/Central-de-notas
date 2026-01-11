
import React from 'react';
import { AppData } from '../types';

interface Props {
  data: AppData;
  onImport: (d: AppData) => void;
  onLogout: () => void;
}

const Settings: React.FC<Props> = ({ data, onImport, onLogout }) => {
  
  const exportData = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_notas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (confirm('Isso substituirá todos os seus dados atuais. Continuar?')) {
          onImport(importedData);
        }
      } catch (err) {
        alert('Erro ao importar arquivo. Certifique-se que é um JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const shareStats = async () => {
    const text = `Meu desempenho escolar no Colégio Gaspar:\nMédia Geral: ${(data.subjects.length > 0 ? (data.subjects.reduce((a, b) => a + 1, 0)) : 0)}\nApp NotaEscolar Pro`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Desempenho Acadêmico - Gaspar',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Resumo copiado para a área de transferência!');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Configurações</h1>
        <p className="text-slate-500 font-medium">Gerencie sua conta e segurança dos dados.</p>
      </header>

      <div className="space-y-4">
        {/* User Info Section */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl font-black text-amber-400">
            {data.user?.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{data.user?.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{data.user?.grade} • Colégio Gaspar</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors"
            title="Sair da conta"
          >
            🚪
          </button>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 mb-3 flex items-center uppercase tracking-widest">
            <span className="mr-3 text-lg">💾</span> Backup de Dados
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Seus dados são salvos localmente. Exporte um backup para garantir que suas notas estejam seguras em caso de troca de navegador.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={exportData}
              className="flex-1 bg-slate-900 text-amber-400 font-black py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 uppercase text-xs tracking-widest"
            >
              Exportar JSON
            </button>
            <label className="flex-1 bg-slate-50 border-2 border-slate-100 text-slate-600 font-black py-4 px-6 rounded-2xl hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center uppercase text-xs tracking-widest">
              Importar Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 mb-3 flex items-center uppercase tracking-widest">
            <span className="mr-3 text-lg">📤</span> Compartilhar
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Gere um resumo rápido do seu desempenho para enviar via WhatsApp ou salvar como nota.
          </p>
          <button 
            onClick={shareStats}
            className="w-full bg-indigo-600 text-white font-black py-4 px-6 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 uppercase text-xs tracking-widest"
          >
            Compartilhar Desempenho
          </button>
        </section>

        <section className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100">
          <h2 className="text-sm font-black text-rose-800 mb-3 flex items-center uppercase tracking-widest">
            <span className="mr-3 text-lg">⚠️</span> Zona de Perigo
          </h2>
          <p className="text-xs text-rose-700 mb-6 font-medium leading-relaxed">
            A limpeza de dados é irreversível. Todas as suas notas, matérias e cronômetros serão deletados permanentemente.
          </p>
          <button 
            onClick={() => { if(confirm('Tem certeza que deseja apagar TUDO? Esta ação não pode ser desfeita.')) { localStorage.clear(); window.location.reload(); } }}
            className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] hover:text-rose-700 transition-colors"
          >
            Resetar todos os dados do App
          </button>
        </section>
      </div>

      <footer className="pt-12 pb-8 text-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 font-black text-sm mb-2 shadow-lg">CG</div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Colégio Gaspar - Venâncio Aires</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
            Desenvolvido com a ajuda de <span className="text-indigo-600">Lara Rieger</span>
          </p>
        </div>
        <p className="text-[9px] text-slate-300 font-medium uppercase tracking-widest">NotaEscolar Pro • Versão 2.0.0</p>
      </footer>
    </div>
  );
};

export default Settings;
