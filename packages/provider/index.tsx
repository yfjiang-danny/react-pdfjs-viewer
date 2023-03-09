import React, { FC, useState } from "react";
import { OptionModel, ScaleType } from "../types";
import { InternalStateContext, useInternalStateHook } from "./internal";

interface PDFViewerInitialState {
  pdfURI: string;
  page?: number;
  scale?: ScaleType;
  scaleOptions?: OptionModel[];
}

interface PDFViewerState {
  pdfURI: string;
  setPdfURI: React.Dispatch<React.SetStateAction<string>>;
  scale: ScaleType;
  setScale: React.Dispatch<React.SetStateAction<ScaleType>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
}

function usePDFViewerHook(
  initialState: PDFViewerInitialState = {
    scale: "auto",
    page: 0,
    pdfURI: "",
  }
): PDFViewerState {
  const [pdfURI, setPdfURI] = useState<string>(initialState.pdfURI);
  const [scale, setScale] = useState<ScaleType>(initialState.scale || "auto");
  const [currentPage, setCurrentPage] = useState<number>(
    initialState.page || 0
  );
  const [totalPage, setTotalPage] = useState<number>(0);

  return {
    pdfURI,
    setPdfURI,
    scale,
    setScale,
    currentPage,
    setCurrentPage,
    totalPage,
    setTotalPage,
  };
}

const PDFViewerContext = React.createContext<PDFViewerState | null>(null);

function usePDFViewer(): PDFViewerState {
  const state = React.useContext(PDFViewerContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

interface PDFViewerProviderProps {
  initialState?: PDFViewerInitialState;
}

/**
 * PDFViewer context provider
 * @param props
 * @returns
 */
const PDFViewerProvider: FC<PDFViewerProviderProps> = (props) => {
  const value = usePDFViewerHook(props.initialState);
  const internalState = useInternalStateHook();

  return (
    <PDFViewerContext.Provider value={value}>
      <InternalStateContext.Provider value={internalState}>
        {props.children}
      </InternalStateContext.Provider>
    </PDFViewerContext.Provider>
  );
};

export { usePDFViewer, PDFViewerProvider };
