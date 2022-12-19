import React from "react";
interface InternalState {
    scaleNumberRef: React.MutableRefObject<number>;
}
declare function useInternalStateHook(): InternalState;
declare const InternalStateContext: React.Context<InternalState | null>;
declare function useInternalState(): InternalState;
export { InternalStateContext, useInternalStateHook, useInternalState };
