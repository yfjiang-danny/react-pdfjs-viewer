/// <reference types="react" />
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { PageSize, ScaleType } from "../types";
interface PageResizerProps {
    doc?: PDFDocumentProxy;
    scale: ScaleType;
    resizerRef: React.MutableRefObject<HTMLDivElement | null>;
}
declare function usePageResizer({ resizerRef, doc, scale }: PageResizerProps): PageSize;
export { usePageResizer };
