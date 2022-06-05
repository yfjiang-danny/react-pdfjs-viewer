import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent } from "react";
interface CanvasLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    width: number;
    height: number;
    scale: number;
}
declare const CanvasLayer: FunctionComponent<CanvasLayerProps>;
export default CanvasLayer;
