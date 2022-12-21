import React, { FC } from "react";
import { OptionModel, ScaleType } from "../types";
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
declare function usePDFViewer(): PDFViewerState;
interface PDFViewerProviderProps {
    initialState?: PDFViewerInitialState;
}
/**
 * PDFViewer context provider
 * @param props
 * @returns
 */
declare const PDFViewerProvider: FC<PDFViewerProviderProps>;
export { usePDFViewer, PDFViewerProvider };
