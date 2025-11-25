
export enum Tone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  ACADEMIC = 'Academic',
  CREATIVE = 'Creative',
  PERSUASIVE = 'Persuasive'
}

export enum Persona {
  GENERAL = 'General Assistant',
  MARKETER = 'Growth Marketer',
  LAWYER = 'Legal Consultant',
  DEV = 'Senior Developer',
  TEACHER = 'Academic Tutor',
  CEO = 'Startup CEO',
  COPYWRITER = 'Creative Copywriter'
}

export enum ModelLength {
  SHORT = 'Short (Concise)',
  MEDIUM = 'Medium (Standard)',
  LONG = 'Long (Detailed)'
}

export enum PromptMode {
  GENERATE = 'Generate',
  IMPROVE = 'Improve'
}

export interface TrainingExample {
  id: string;
  input: string;
  output: string;
}

export interface HistoryItem {
  id: string;
  intent: string;
  generatedPrompt: string;
  timestamp: number;
  persona?: Persona;
  tone?: Tone;
  length?: ModelLength;
  mode?: PromptMode;
}

export interface PromptRequest {
  intent: string;
  tone: Tone;
  length: ModelLength;
  persona: Persona;
  mode: PromptMode;
  examples: TrainingExample[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'email';
}
