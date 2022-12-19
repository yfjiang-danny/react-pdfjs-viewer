/// <reference types="react" />
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { PageSize, ScaleType } from "../types";
interface PageResizesProps {
    doc?: PDFDocumentProxy;
    scale: ScaleType;
    resizesRef: React.MutableRefObject<HTMLDivElement | null>;
}
declare function usePageResizes({ resizesRef, doc, scale }: PageResizesProps): PageSize;
export { usePageResizes };
