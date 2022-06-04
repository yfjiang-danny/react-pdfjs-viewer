import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { ReactNode } from "react";
interface PageLayerProps {
    pageIndex: number;
    doc: PDFDocumentProxy;
    width: number;
    height: number;
    children: (doc: PDFPageProxy) => ReactNode | ReactNode[];
}
declare const PageLayer: React.FunctionComponent<PageLayerProps>;
export default PageLayer;
