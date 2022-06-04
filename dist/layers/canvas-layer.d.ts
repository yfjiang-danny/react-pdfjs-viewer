import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React from "react";
interface CanvasLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    width: number;
    height: number;
    scale: number;
}
declare const CanvasLayer: React.FunctionComponent<CanvasLayerProps>;
export default CanvasLayer;
