import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Presentation } from '../types/presentation';
import { presentationApi, ApiError } from '../services/api';

type State = {
  presentations: Presentation[];
  loading: boolean;
  error: string | null;
  selectedPresentation: Presentation | null;
};

type Action =
  | { type: 'FETCH_PRESENTATIONS_START' }
  | { type: 'FETCH_PRESENTATIONS_SUCCESS'; payload: Presentation[] }
  | { type: 'FETCH_PRESENTATIONS_ERROR'; payload: string }
  | { type: 'SELECT_PRESENTATION'; payload: Presentation }
  | { type: 'ADD_PRESENTATION'; payload: Presentation }
  | { type: 'UPDATE_PRESENTATION'; payload: Presentation }
  | { type: 'END_PRESENTATION'; payload: Presentation };

const initialState: State = {
  presentations: [],
  loading: false,
  error: null,
  selectedPresentation: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_PRESENTATIONS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_PRESENTATIONS_SUCCESS':
      return { ...state, presentations: action.payload, loading: false };
    case 'FETCH_PRESENTATIONS_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT_PRESENTATION':
      return { ...state, selectedPresentation: action.payload };
    case 'ADD_PRESENTATION':
      return { ...state, presentations: [...state.presentations, action.payload] };
    case 'UPDATE_PRESENTATION':
      return {
        ...state,
        presentations: state.presentations.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'END_PRESENTATION':
      return {
        ...state,
        presentations: state.presentations.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    default:
      return state;
  }
}

type ContextType = {
  state: State;
  fetchPresentations: () => Promise<void>;
  selectPresentation: (presentation: Presentation) => void;
  createPresentation: (title: string, description: string) => Promise<void>;
  endPresentation: (id: string) => Promise<void>;
};

const PresentationContext = createContext<ContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPresentations = async () => {
    dispatch({ type: 'FETCH_PRESENTATIONS_START' });
    try {
      const presentations = await presentationApi.getAll();
      dispatch({ type: 'FETCH_PRESENTATIONS_SUCCESS', payload: presentations });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch presentations';
      dispatch({ type: 'FETCH_PRESENTATIONS_ERROR', payload: message });
    }
  };

  const selectPresentation = (presentation: Presentation) => {
    dispatch({ type: 'SELECT_PRESENTATION', payload: presentation });
  };

  const createPresentation = async (title: string, description: string) => {
    try {
      const newPresentation = await presentationApi.create({ title, description });
      dispatch({ type: 'ADD_PRESENTATION', payload: newPresentation });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to create presentation';
      dispatch({ type: 'FETCH_PRESENTATIONS_ERROR', payload: message });
    }
  };

  const endPresentation = async (id: string) => {
    try {
      const updatedPresentation = await presentationApi.end(id);
      dispatch({ type: 'END_PRESENTATION', payload: updatedPresentation });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to end presentation';
      dispatch({ type: 'FETCH_PRESENTATIONS_ERROR', payload: message });
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  return (
    <PresentationContext.Provider
      value={{
        state,
        fetchPresentations,
        selectPresentation,
        createPresentation,
        endPresentation,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
} 