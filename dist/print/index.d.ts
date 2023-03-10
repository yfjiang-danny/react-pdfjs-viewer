import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FC } from "react";
interface PrintProps {
    width: number;
    height: number;
    pdfDoc: PDFDocumentProxy;
}
declare const Print: FC<PrintProps>;
export default Print;
