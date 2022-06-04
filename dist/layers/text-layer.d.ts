import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React from "react";
interface TextLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    scale: number;
}
declare const TextLayer: React.FunctionComponent<TextLayerProps>;
export default TextLayer;
