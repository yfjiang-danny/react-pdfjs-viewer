import React, { ReactNode } from "react";
import { ScaleType } from "../types";
interface PDFViewerProps {
    pdfURI: string;
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    scale: ScaleType;
}
declare const PDFViewer: React.FunctionComponent<PDFViewerProps>;
export default PDFViewer;
