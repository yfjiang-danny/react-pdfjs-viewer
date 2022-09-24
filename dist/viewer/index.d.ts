import { FC, ReactNode } from "react";
import { ScrollMode } from "../types";
import "../styles/viewer.less";
interface PDFViewerProps {
    pdfURI: string;
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    width: string | number;
    height: string | number;
    scrollMode?: ScrollMode;
}
declare const PDFViewer: FC<PDFViewerProps>;
export default PDFViewer;
