'use client';

import { useReducer, useCallback } from 'react';
import {
  WorkflowState,
  WorkflowAction,
  WorkflowStep,
  ChatMessage,
  Inspiration,
  GeneratedImage,
  Caption,
  initialWorkflowState,
} from '@/types/workflow';

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CONTENT_TYPE':
      return { ...state, contentType: action.payload };
    case 'SET_AESTHETIC':
      return { ...state, aesthetic: action.payload };
    case 'SET_INSPIRATION':
      return { ...state, inspiration: action.payload };
    case 'SET_GENERATED_IMAGE':
      return { ...state, generatedImage: action.payload };
    case 'SET_CAPTIONS':
      return { ...state, captions: action.payload };
    case 'INCREMENT_REVISION':
      return { ...state, revisionCount: state.revisionCount + 1 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialWorkflowState;
    default:
      return state;
  }
}

export function useCreativeWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);

  const setStep = useCallback((step: WorkflowStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const setContentType = useCallback((contentType: string) => {
    dispatch({ type: 'SET_CONTENT_TYPE', payload: contentType });
  }, []);

  const setAesthetic = useCallback((aesthetic: string) => {
    dispatch({ type: 'SET_AESTHETIC', payload: aesthetic });
  }, []);

  const setInspiration = useCallback((inspiration: Inspiration) => {
    dispatch({ type: 'SET_INSPIRATION', payload: inspiration });
  }, []);

  const setGeneratedImage = useCallback((image: GeneratedImage) => {
    dispatch({ type: 'SET_GENERATED_IMAGE', payload: image });
  }, []);

  const setCaptions = useCallback((captions: Caption[]) => {
    dispatch({ type: 'SET_CAPTIONS', payload: captions });
  }, []);

  const incrementRevision = useCallback(() => {
    dispatch({ type: 'INCREMENT_REVISION' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      setStep,
      addMessage,
      setContentType,
      setAesthetic,
      setInspiration,
      setGeneratedImage,
      setCaptions,
      incrementRevision,
      setLoading,
      setError,
      reset,
    },
  };
}
