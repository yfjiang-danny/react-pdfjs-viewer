import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
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
    pdfDoc: PDFDocumentProxy | undefined;
    setPDFDoc: React.Dispatch<React.SetStateAction<PDFDocumentProxy | undefined>>;
    scale: ScaleType;
    setScale: React.Dispatch<React.SetStateAction<ScaleType>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPage: number;
    setTotalPage: React.Dispatch<React.SetStateAction<number>>;
    sidebarVisible: boolean;
    setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
    propertyModalVisible: boolean;
    setPropertyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
