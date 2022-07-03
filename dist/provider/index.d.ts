import React, { FC } from "react";
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
declare function usePDFViewer(): PDFViewerState;
interface PDFViewerProviderProps {
    initialState?: PDFViewerInitialState;
}
declare const PDFViewerProvider: FC<PDFViewerProviderProps>;
export { usePDFViewer, PDFViewerProvider };
