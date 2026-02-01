// Workflow Types for Maya Creative Studio

export type WorkflowStep = 'describe' | 'inspire' | 'style' | 'create' | 'refine' | 'copy';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface Inspiration {
  type: 'upload' | 'link' | 'skip';
  url?: string;
  file?: File;
  analysis?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  aesthetic: string;
  contentType: string;
  timestamp: Date;
}

export interface Caption {
  tone: 'professional' | 'conversational' | 'urgent' | 'playful';
  text: string;
  hashtags: string;
  platform: string;
}

export interface WorkflowState {
  currentStep: WorkflowStep;
  messages: ChatMessage[];
  contentType: string | null;
  aesthetic: string | null;
  inspiration: Inspiration | null;
  generatedImage: GeneratedImage | null;
  captions: Caption[];
  revisionCount: number;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction =
  | { type: 'SET_STEP'; payload: WorkflowStep }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CONTENT_TYPE'; payload: string }
  | { type: 'SET_AESTHETIC'; payload: string }
  | { type: 'SET_INSPIRATION'; payload: Inspiration }
  | { type: 'SET_GENERATED_IMAGE'; payload: GeneratedImage }
  | { type: 'SET_CAPTIONS'; payload: Caption[] }
  | { type: 'INCREMENT_REVISION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

export const initialWorkflowState: WorkflowState = {
  currentStep: 'describe',
  messages: [],
  contentType: null,
  aesthetic: null,
  inspiration: null,
  generatedImage: null,
  captions: [],
  revisionCount: 0,
  isLoading: false,
  error: null,
};

export const steps: { id: WorkflowStep; label: string }[] = [
  { id: 'describe', label: 'Describe' },
  { id: 'inspire', label: 'Inspire' },
  { id: 'style', label: 'Style' },
  { id: 'create', label: 'Create' },
  { id: 'refine', label: 'Refine' },
  { id: 'copy', label: 'Copy' },
];
