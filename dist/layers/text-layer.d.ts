import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent } from "react";
interface TextLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    scale: number;
}
declare const TextLayer: FunctionComponent<TextLayerProps>;
export default TextLayer;
