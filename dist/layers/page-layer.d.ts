import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent, ReactNode } from "react";
import "../styles/page-layer.less";
import { ScrollMode } from "../types";
interface PageLayerProps {
    pageIndex: number;
    doc: PDFDocumentProxy;
    width: number;
    height: number;
    children: (doc: PDFPageProxy) => ReactNode | ReactNode[];
    scrollMode: ScrollMode;
}
declare const PageLayer: FunctionComponent<PageLayerProps>;
export default PageLayer;
