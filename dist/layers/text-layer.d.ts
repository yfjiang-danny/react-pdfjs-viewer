import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent } from "react";
import "../styles/text-layer.less";
interface TextLayerProps {
    pageDoc: PDFPageProxy;
    pageIndex: number;
    width: number;
    height: number;
    scale: number;
}
declare const TextLayer: FunctionComponent<TextLayerProps>;
export default TextLayer;
