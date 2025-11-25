
import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Settings2, Menu, Terminal, User as UserIcon, Hexagon, LogOut, LogIn, RefreshCw, Wand2, Sun, Moon, BrainCircuit, MessageSquare, ChevronDown } from 'lucide-react';
import { Tone, ModelLength, HistoryItem, Persona, User, PromptMode, TrainingExample } from './types';
import { generateOptimizedPrompt } from './services/geminiService';
import Button from './components/Button';
import HistorySidebar from './components/HistorySidebar';
import { BackgroundPaths } from './components/BackgroundPaths';
import AuthModal from './components/AuthModal';
import TrainingModal from './components/TrainingModal';
import { SpotlightCard } from './components/SpotlightCard';
import { MagicButton } from './components/MagicButton';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme as 'dark' | 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // State
  const [mode, setMode] = useState<PromptMode>(PromptMode.GENERATE);
  const [intent, setIntent] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [length, setLength] = useState<ModelLength>(ModelLength.MEDIUM);
  const [persona, setPersona] = useState<Persona>(Persona.GENERAL);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Training Examples
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load history, auth, and examples
  useEffect(() => {
    const savedHistory = localStorage.getItem('prompt_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedUser = localStorage.getItem('prompt_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

    const savedExamples = localStorage.getItem('prompt_examples');
    if (savedExamples) {
      try {
        setExamples(JSON.parse(savedExamples));
      } catch (e) {
        console.error("Failed to parse examples", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('prompt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prompt_user');
    }
  }, [user]);

  const handleSaveExamples = (newExamples: TrainingExample[]) => {
    setExamples(newExamples);
    localStorage.setItem('prompt_examples', JSON.stringify(newExamples));
  };

  const handlePersonaChange = (newPersona: Persona) => {
    setPersona(newPersona);
    switch (newPersona) {
      case Persona.MARKETER: setTone(Tone.PERSUASIVE); break;
      case Persona.LAWYER: setTone(Tone.PROFESSIONAL); break;
      case Persona.DEV: setTone(Tone.PROFESSIONAL); break;
      case Persona.TEACHER: setTone(Tone.ACADEMIC); break;
      case Persona.COPYWRITER: setTone(Tone.CREATIVE); break;
      case Persona.CEO: setTone(Tone.PROFESSIONAL); break;
      default: if (newPersona === Persona.GENERAL) setTone(Tone.PROFESSIONAL);
    }
  };

  const handleGenerate = async () => {
    if (!intent.trim()) return;
    setIsGenerating(true);
    setResult('');
    setCopied(false);
    try {
      const generatedText = await generateOptimizedPrompt({ 
        intent, 
        tone, 
        length, 
        persona, 
        mode,
        examples // Pass custom examples to service
      });
      setResult(generatedText);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        intent,
        generatedPrompt: generatedText,
        timestamp: Date.now(),
        persona,
        tone,
        length,
        mode
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (error) {
      console.error(error);
      setResult("Sorry, something went wrong. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setIntent(item.intent);
    setResult(item.generatedPrompt);
    if (item.persona) setPersona(item.persona);
    if (item.tone) setTone(item.tone);
    if (item.length) setLength(item.length);
    if (item.mode) setMode(item.mode);
    setCopied(false);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const clearHistory = () => {
    if(confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-brand-500/30 relative transition-colors duration-300">

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />

      <TrainingModal 
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        examples={examples}
        onSave={handleSaveExamples}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white/80 dark:bg-[#0b1121]/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5
      `}>
        <HistorySidebar 
          history={history} 
          onSelect={loadHistoryItem} 
          onClear={clearHistory}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        
        {/* Header */}
        <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-20 absolute w-full transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 group select-none cursor-pointer" onClick={() => { setIntent(''); setResult(''); }}>
               <div className="relative">
                 <div className="absolute inset-0 bg-brand-500/30 blur-md rounded-full group-hover:bg-brand-400/50 transition-colors duration-300"></div>
                 <div className="relative bg-white dark:bg-[#020617] p-1.5 sm:p-2 rounded-xl border border-brand-500/30 shadow-[0_0_15px_-3px_rgba(20,184,166,0.3)] group-hover:border-brand-400/50 transition-colors">
                   <Hexagon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-brand-400 stroke-[2] group-hover:rotate-90 transition-transform duration-500 ease-out" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-600 dark:bg-white rounded-full shadow-[0_0_10px_white]" />
                   </div>
                 </div>
               </div>
               <div className="flex flex-col">
                 <h1 className="font-bold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                   Prompt<span className="text-brand-600 dark:text-brand-400">Forge</span>
                 </h1>
                 <span className="text-[0.5rem] sm:text-[0.6rem] font-mono text-brand-600/70 dark:text-brand-300/70 tracking-[0.2em] uppercase mt-0.5 ml-0.5">
                   Studio
                 </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

             <div className="hidden sm:flex items-center text-xs font-mono text-brand-700 dark:text-brand-300 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
               <Terminal className="w-3 h-3 mr-2" />
               gemini-2.5-flash
             </div>

             {/* Training Button */}
             <button
                onClick={() => setIsTrainingModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                title="Add examples to train the model style"
             >
                <BrainCircuit className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Train Model
             </button>
             
             {/* Auth Button / Profile */}
             {user ? (
               <div className="relative">
                 <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                 >
                   {user.avatar ? (
                     <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10" />
                   ) : (
                     <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300">
                       <UserIcon className="w-4 h-4" />
                     </div>
                   )}
                   <span className="text-sm font-medium text-slate-700 dark:text-gray-200 hidden md:block">{user.name}</span>
                 </button>

                 {isUserMenuOpen && (
                   <>
                     <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)}></div>
                     <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                       <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                         <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{user.name}</p>
                         <p className="text-xs text-slate-500 dark:text-gray-500 truncate">{user.email}</p>
                       </div>
                       
                       {/* Mobile Training Link */}
                       <button onClick={() => { setIsTrainingModalOpen(true); setIsUserMenuOpen(false); }} className="md:hidden w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                         <BrainCircuit className="w-4 h-4" />
                         Train Model
                       </button>

                       <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                         <LogOut className="w-4 h-4" />
                         Sign out
                       </button>
                     </div>
                   </>
                 )}
               </div>
             ) : (
               <Button 
                 variant="secondary" 
                 onClick={() => setIsAuthModalOpen(true)}
                 className="flex text-xs h-9"
                 icon={<LogIn className="w-4 h-4" />}
               >
                 Sign In
               </Button>
             )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
          
          <BackgroundPaths title="Prompt Forge AI">
            
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base md:text-xl font-light mb-8 sm:mb-12 -mt-2 sm:-mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
                Context-aware engineering for sophisticated LLM interactions
            </p>

            {/* 3D Main Spotlight Card */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 perspective-[2000px]">
              <SpotlightCard className="w-full">
                  <div className="p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    
                    {/* Mode Toggle */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div className="inline-flex bg-slate-100 dark:bg-[#020617]/80 p-0.5 sm:p-1 rounded-lg border border-slate-200 dark:border-white/5 relative shadow-inner w-full sm:w-auto">
                          <button 
                            onClick={() => setMode(PromptMode.GENERATE)}
                            className={`
                                relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 z-10 flex-1 sm:flex-initial
                                ${mode === PromptMode.GENERATE ? 'text-brand-700 dark:text-brand-300 shadow-sm bg-white dark:bg-white/5' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'}
                            `}
                          >
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Generate New</span>
                            <span className="xs:hidden">Generate</span>
                          </button>
                          
                          <div className="w-px bg-slate-300 dark:bg-white/5 my-1 mx-0.5 sm:mx-1"></div>

                          <button 
                            onClick={() => setMode(PromptMode.IMPROVE)}
                            className={`
                                relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 z-10 flex-1 sm:flex-initial
                                ${mode === PromptMode.IMPROVE ? 'text-brand-700 dark:text-brand-300 shadow-sm bg-white dark:bg-white/5' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'}
                            `}
                          >
                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Improve Existing</span>
                            <span className="xs:hidden">Improve</span>
                          </button>
                        </div>

                        {examples.length > 0 && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[0.65rem] sm:text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-brand-500/20 animate-in fade-in">
                            <BrainCircuit className="w-3 h-3" />
                            <span className="hidden sm:inline">{examples.length} Training Examples Active</span>
                            <span className="sm:hidden">{examples.length} Examples</span>
                          </div>
                        )}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label htmlFor="intent" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-brand-700 dark:text-brand-300 ml-1 animate-in fade-in slide-in-from-left-2">
                        {mode === PromptMode.GENERATE ? (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Your Goal / Idea
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-4 h-4" />
                                Existing Prompt Draft
                            </>
                        )}
                      </label>
                      <div className="relative group">
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                         <textarea
                            id="intent"
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                            placeholder={mode === PromptMode.GENERATE 
                              ? "e.g., A step-by-step guide on how to build a React app with Tailwind CSS..." 
                              : "Paste your rough prompt here and we'll engineer it to perfection..."}
                            className="relative w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-[#020617] text-sm sm:text-base text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600 resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[0.65rem] sm:text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider ml-1">Persona</label>
                        <div className="relative">
                          <select 
                            value={persona}
                            onChange={(e) => handlePersonaChange(e.target.value as Persona)}
                            className="w-full appearance-none bg-slate-50 dark:bg-white/5 text-sm sm:text-base text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors cursor-pointer"
                          >
                            {Object.values(Persona).map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 sm:right-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[0.65rem] sm:text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider ml-1">Tone</label>
                        <div className="relative">
                          <select 
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            className="w-full appearance-none bg-slate-50 dark:bg-white/5 text-sm sm:text-base text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors cursor-pointer"
                          >
                            {Object.values(Tone).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <Settings2 className="absolute right-2 sm:right-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[0.65rem] sm:text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider ml-1">Length</label>
                        <div className="relative">
                          <select 
                            value={length}
                            onChange={(e) => setLength(e.target.value as ModelLength)}
                            className="w-full appearance-none bg-slate-50 dark:bg-white/5 text-sm sm:text-base text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors cursor-pointer"
                          >
                            {Object.values(ModelLength).map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 sm:right-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 sm:pt-2">
                        <MagicButton 
                            onClick={handleGenerate} 
                            isLoading={isGenerating} 
                            className="w-full text-sm sm:text-base"
                            icon={mode === PromptMode.GENERATE ? <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        >
                            <span className="hidden sm:inline">{mode === PromptMode.GENERATE ? 'Generate Engineered Prompt' : 'Analyze & Improve Prompt'}</span>
                            <span className="sm:hidden">{mode === PromptMode.GENERATE ? 'Generate Prompt' : 'Improve Prompt'}</span>
                        </MagicButton>
                    </div>

                  </div>
              </SpotlightCard>
            </div>

            {/* Results Section */}
            {result && (
                <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-16 sm:pb-20 mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="relative group perspective-[2000px]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/30 to-purple-600/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative glass-panel rounded-xl overflow-hidden shadow-2xl">
                      
                      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs font-mono text-slate-600 dark:text-gray-300 uppercase tracking-widest">Output Generated</span>
                        </div>
                        <button 
                          onClick={handleCopy}
                          className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-white/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied' : 'Copy Output'}
                        </button>
                      </div>

                      <div className="p-6 md:p-8 bg-white/80 dark:bg-[#0b1121]/90 backdrop-blur-xl min-h-[200px] text-left">
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700 dark:text-gray-300">
                          {result}
                        </pre>
                      </div>

                    </div>
                  </div>
                </div>
            )}
            
            {!result && (
                 <div className="h-32"></div> /* Spacer */
            )}

          </BackgroundPaths>
        </main>
      </div>
    </div>
  );
};

export default App;
