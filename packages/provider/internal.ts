import React, { useRef } from "react";

interface InternalState {
  scaleNumberRef: React.MutableRefObject<number>;
}

function useInternalStateHook(): InternalState {
  const scaleNumberRef = useRef(1);

  return {
    scaleNumberRef,
  };
}

const InternalStateContext = React.createContext<InternalState | null>(null);

function useInternalState(): InternalState {
  const state = React.useContext(InternalStateContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

export { InternalStateContext, useInternalStateHook, useInternalState };
