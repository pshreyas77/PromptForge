
import React, { useState } from 'react';
import { X, Plus, Trash2, BrainCircuit, Save } from 'lucide-react';
import Button from './Button';
import { TrainingExample } from '../types';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  examples: TrainingExample[];
  onSave: (examples: TrainingExample[]) => void;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, examples, onSave }) => {
  const [localExamples, setLocalExamples] = useState<TrainingExample[]>(examples);
  const [newInput, setNewInput] = useState('');
  const [newOutput, setNewOutput] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newInput.trim() || !newOutput.trim()) return;
    
    const newExample: TrainingExample = {
      id: Date.now().toString(),
      input: newInput,
      output: newOutput
    };

    setLocalExamples([...localExamples, newExample]);
    setNewInput('');
    setNewOutput('');
  };

  const handleDelete = (id: string) => {
    setLocalExamples(localExamples.filter(ex => ex.id !== id));
  };

  const handleSaveAndClose = () => {
    onSave(localExamples);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="glass-panel rounded-2xl p-1 shadow-2xl flex flex-col h-full">
          <div className="bg-white/95 dark:bg-[#0b1121]/95 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl flex flex-col h-full">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-lg">
                  <BrainCircuit className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Model Training</h2>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Add examples to teach the AI your preferred style.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Add New Section */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Example
                </h3>
                <div className="space-y-3">
                  <div>
                    <input
                      value={newInput}
                      onChange={(e) => setNewInput(e.target.value)}
                      placeholder="User Input (e.g., 'Write a tweet about AI')"
                      className="w-full bg-white dark:bg-[#020617] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <textarea
                      value={newOutput}
                      onChange={(e) => setNewOutput(e.target.value)}
                      placeholder="Ideal Prompt Output (How you want the AI to write it)"
                      className="w-full bg-white dark:bg-[#020617] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/30 outline-none h-24 resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAdd} 
                      disabled={!newInput.trim() || !newOutput.trim()}
                      className="h-8 text-xs"
                      variant="secondary"
                    >
                      Add Example
                    </Button>
                  </div>
                </div>
              </div>

              {/* List of Examples */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  Active Examples ({localExamples.length})
                </h3>
                
                {localExamples.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-gray-600 text-sm border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                    No examples yet. Add one above to train the model.
                  </div>
                ) : (
                  localExamples.map((ex) => (
                    <div key={ex.id} className="group relative bg-white dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 hover:border-brand-500/30 transition-colors">
                      <button 
                        onClick={() => handleDelete(ex.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-mono text-brand-600 dark:text-brand-400 mb-1 block">INPUT</span>
                          <p className="text-sm text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-black/20 p-2 rounded-lg">{ex.input}</p>
                        </div>
                        <div>
                          <span className="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1 block">OUTPUT</span>
                          <p className="text-sm text-slate-700 dark:text-gray-300 font-mono text-xs bg-slate-50 dark:bg-black/20 p-2 rounded-lg whitespace-pre-wrap h-full max-h-32 overflow-y-auto">{ex.output}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex justify-end shrink-0">
               <Button onClick={handleSaveAndClose} icon={<Save className="w-4 h-4" />}>
                 Save Changes
               </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingModal;
