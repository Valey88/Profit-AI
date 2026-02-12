import React, { useState, useEffect } from 'react';
import { Save, Upload, FileText, Trash2, Cpu, BookOpen, Mic, Calendar, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { useAgentConfig, useUpdateAgentConfig, useUploadKnowledge, useDeleteKnowledge } from '@/shared/api/hooks';
import type { AgentConfigUpdate } from '@/shared/api/client';

export const AgentSettingsPage: React.FC = () => {
  const { data: remoteConfig, isLoading } = useAgentConfig();
  const updateConfigMutation = useUpdateAgentConfig();
  const uploadKnowledgeMutation = useUploadKnowledge();
  const deleteKnowledgeMutation = useDeleteKnowledge();

  // Local state for form editing
  const [localConfig, setLocalConfig] = useState<AgentConfigUpdate>({
    name: '',
    role: '',
    tone: '',
    system_prompt: '',
    skills: {
      payments: false,
      calendar: false,
      voiceToText: false
    }
  });

  // Sync remote data to local state
  useEffect(() => {
    if (remoteConfig) {
      setLocalConfig({
        name: remoteConfig.name,
        role: remoteConfig.role,
        tone: remoteConfig.tone,
        system_prompt: remoteConfig.system_prompt,
        skills: remoteConfig.skills || {}
      });
    }
  }, [remoteConfig]);

  const handleSave = async () => {
    try {
      await updateConfigMutation.mutateAsync(localConfig);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await uploadKnowledgeMutation.mutateAsync(e.target.files[0]);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  const handleFileDelete = async (id: number) => {
    try {
      await deleteKnowledgeMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setLocalConfig(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: !prev.skills?.[skill]
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 relative">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight">Настройка ИИ агента</h1>
            <p className="text-zinc-500 mt-2 text-sm">Настройте параметры нейросети и контекст базы знаний.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={updateConfigMutation.isPending}
            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 disabled:opacity-50"
          >
            {updateConfigMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Сохранить
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Persona Section */}
            <section className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Личность ИИ</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Имя</label>
                  <input
                    type="text"
                    value={localConfig.name || ''}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Роль</label>
                  <input
                    type="text"
                    value={localConfig.role || ''}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Тон общения (Tone of Voice)</label>
                <input
                  type="text"
                  value={localConfig.tone || ''}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Системный промпт</label>
                <div className="relative group">
                  <textarea
                    rows={10}
                    value={localConfig.system_prompt || ''}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, system_prompt: e.target.value }))}
                    className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-mono text-zinc-300 leading-relaxed resize-none transition-all"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> GPT-4o
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Knowledge Base Section */}
            <section className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">База Знаний</h2>
                    <p className="text-xs text-zinc-500">RAG Context</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-500 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  {remoteConfig?.knowledge_files.length || 0} файла
                </span>
              </div>

              <div className="relative border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all mb-4 group bg-black/20">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={uploadKnowledgeMutation.isPending}
                />
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/5 shadow-lg">
                  {uploadKnowledgeMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  ) : (
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                  )}
                </div>
                <p className="text-sm font-semibold text-zinc-200">Перетащите файлы</p>
                <p className="text-xs text-zinc-500 mt-1">PDF, DOCX, TXT (макс 10MB)</p>
              </div>

              <div className="space-y-3">
                {remoteConfig?.knowledge_files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black/30 rounded flex items-center justify-center border border-white/5">
                        <FileText className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-300 font-medium truncate max-w-[200px]">{file.filename}</span>
                        <span className="text-[10px] text-zinc-600">{(file.file_size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileDelete(file.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                      disabled={deleteKnowledgeMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Skills */}
          <div className="space-y-6">
            <section className="glass-card p-6 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6">Активные навыки</h2>

              <div className="space-y-2">
                {/* Payments */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${localConfig.skills?.payments ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-200">Оплата</p>
                      <p className="text-xs text-zinc-500">Генерация ссылок</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSkillToggle('payments')}
                    className={`w-10 h-6 rounded-full transition-all relative ${localConfig.skills?.payments ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${localConfig.skills?.payments ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="h-px bg-white/5 mx-3 my-1"></div>

                {/* Calendar */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${localConfig.skills?.calendar ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-200">Календарь</p>
                      <p className="text-xs text-zinc-500">Запись клиентов</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSkillToggle('calendar')}
                    className={`w-10 h-6 rounded-full transition-all relative ${localConfig.skills?.calendar ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${localConfig.skills?.calendar ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="h-px bg-white/5 mx-3 my-1"></div>

                {/* Voice */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${localConfig.skills?.voiceToText ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-200">Voice ID</p>
                      <p className="text-xs text-zinc-500">Распознавание речи</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSkillToggle('voiceToText')}
                    className={`w-10 h-6 rounded-full transition-all relative ${localConfig.skills?.voiceToText ? 'bg-pink-500 shadow-[0_0_10px_#ec4899]' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${localConfig.skills?.voiceToText ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </section>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-3xl border border-yellow-500/20 backdrop-blur-md">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-yellow-200">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Совет
              </h3>
              <p className="text-xs text-yellow-100/70 leading-relaxed">
                Загрузка PDF-прайса повышает точность ответов о ценах на 40%. Убедитесь, что в документе четко указаны названия услуг.
              </p>
            </div>

            {/* Dev: Reset Onboarding */}
            <div className="mt-8 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold text-sm mb-2 text-zinc-400">Разработка</h3>
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding_completed');
                  window.location.reload();
                }}
                className="px-4 py-2 text-sm bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl hover:bg-red-600/30 transition-all"
              >
                Сбросить онбординг
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};