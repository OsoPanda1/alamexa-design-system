// contexts/LoadingContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

type LoadingAction =
  | { type: "START"; payload: { message?: string; type?: LoadingState["type"] } }
  | { type: "PROGRESS"; payload: { progress: number } }
  | { type: "SUCCESS"; payload?: { message?: string } }
  | { type: "ERROR"; payload?: { message?: string } }
  | { type: "STOP" };

type LoadingState = {
  isLoading: boolean;
  progress: number | undefined;
  message: string | undefined;
  type: "primary" | "success" | "error" | "warning";
};

const initialState: LoadingState = {
  isLoading: false,
  progress: undefined,
  message: undefined,
  type: "primary",
};

const LoadingContext = createContext<
  [LoadingState, React.Dispatch<LoadingAction>] | null
>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading debe usarse dentro de LoadingProvider");
  }
  return context[0];
};

export const useLoadingDispatch = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingDispatch debe usarse dentro de LoadingProvider");
  }
  return context[1];
};

const reducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case "START":
      return {
        ...state,
        isLoading: true,
        message: action.payload.message,
        type: action.payload.type || "primary",
        progress: 0,
      };
    case "PROGRESS":
      return { ...state, progress: action.payload.progress };
    case "SUCCESS":
      return {
        ...state,
        type: "success",
        message: action.payload?.message || state.message,
        isLoading: false,
      };
    case "ERROR":
      return {
        ...state,
        type: "error",
        message: action.payload?.message || "Error inesperado",
        isLoading: false,
      };
    case "STOP":
      return { ...initialState };
    default:
      return state;
  }
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LoadingContext.Provider value={[state, dispatch]}>
      {children}
    </LoadingContext.Provider>
  );
};

