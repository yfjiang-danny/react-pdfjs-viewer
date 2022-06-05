import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent, ReactNode } from "react";
interface PageLayerProps {
    pageIndex: number;
    doc: PDFDocumentProxy;
    width: number;
    height: number;
    children: (doc: PDFPageProxy) => ReactNode | ReactNode[];
}
declare const PageLayer: FunctionComponent<PageLayerProps>;
export default PageLayer;
