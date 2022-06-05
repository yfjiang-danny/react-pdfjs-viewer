import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent, ReactNode } from "react";
import { PageSize, ScaleType } from "../types";
interface ResizerProps {
    doc: PDFDocumentProxy;
    scale: ScaleType;
    children: (rect: PageSize) => ReactNode;
}
declare const Resizer: FunctionComponent<ResizerProps>;
export default Resizer;