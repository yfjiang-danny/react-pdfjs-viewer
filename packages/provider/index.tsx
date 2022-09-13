import React, { FC, useState } from "react";
import { ScaleType } from "../types";

interface PDFViewerInitialState {
  scale: ScaleType;
  page: number;
}

interface PDFViewerState {
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
    page: 1,
  }
): PDFViewerState {
  const [scale, setScale] = useState<ScaleType>(initialState.scale);
  const [currentPage, setCurrentPage] = useState<number>(initialState.page);
  const [totalPage, setTotalPage] = useState<number>(0);

  return {
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

const PDFViewerProvider: FC<PDFViewerProviderProps> = (props) => {
  const value = usePDFViewerHook(props.initialState);

  return (
    <PDFViewerContext.Provider value={value}>
      {props.children}
    </PDFViewerContext.Provider>
  );
};

export { usePDFViewer, PDFViewerProvider };
