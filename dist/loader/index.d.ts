import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FunctionComponent, ReactNode } from "react";
interface PDFLoaderProps {
    pdfURI: string;
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    children: (pdfDoc: PDFDocumentProxy) => ReactNode | ReactNode[];
}
declare const PDFLoader: FunctionComponent<PDFLoaderProps>;
export default PDFLoader;
