import { FC, ReactNode } from "react";
import { ScaleType } from "../types";
interface PDFViewerProps {
    pdfURI: string;
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    scale: ScaleType;
}
declare const PDFViewer: FC<PDFViewerProps>;
export default PDFViewer;
