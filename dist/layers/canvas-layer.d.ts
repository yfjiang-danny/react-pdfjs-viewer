import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent } from "react";
import "../styles/canvas-layer.less";
interface CanvasLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    renderingIndex: number;
    width: number;
    height: number;
    scale: number;
    onCompleted(): void;
}
declare const CanvasLayer: FunctionComponent<CanvasLayerProps>;
export default CanvasLayer;
