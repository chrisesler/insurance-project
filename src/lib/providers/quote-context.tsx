'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { QuoteData } from '@/types';

interface QuoteState extends Partial<QuoteData> {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

type QuoteAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'UPDATE_DATA'; data: Partial<QuoteData> }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' }
  | { type: 'LOAD_FROM_STORAGE'; data: Partial<QuoteData> & { currentStep: number } };

const initialState: QuoteState = {
  currentStep: 1,
  isLoading: false,
  error: null,
};

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'UPDATE_DATA':
      return { ...state, ...action.data };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return initialState;
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.data };
    default:
      return state;
  }
}

const QuoteContext = createContext<{
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<QuoteData>) => void;
  saveToStorage: () => void;
  clearStorage: () => void;
} | null>(null);

const STORAGE_KEY = 'insurance-quote-data';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quoteReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_FROM_STORAGE', data: parsed });
      } catch (error) {
        console.error('Failed to load saved quote data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (state.currentStep > 1 || Object.keys(state).some(key => key !== 'currentStep' && key !== 'isLoading' && key !== 'error' && state[key as keyof QuoteState])) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        isLoading: false,
        error: null,
      }));
    }
  }, [state]);

  const nextStep = () => {
    if (state.currentStep < 5) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
    }
  };

  const updateData = (data: Partial<QuoteData>) => {
    dispatch({ type: 'UPDATE_DATA', data });
  };

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      isLoading: false,
      error: null,
    }));
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  };

  return (
    <QuoteContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        updateData,
        saveToStorage,
        clearStorage,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}