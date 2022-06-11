import { FC, ReactNode } from "react";
import { ScaleType, ScrollMode } from "../types";
import "../styles/viewer.less";
interface PDFViewerProps {
    pdfURI: string;
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    scale: ScaleType;
    width: string | number;
    height: string | number;
    scrollMode?: ScrollMode;
}
declare const PDFViewer: FC<PDFViewerProps>;
export default PDFViewer;
