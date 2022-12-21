import { FC, ReactNode } from "react";
import "../styles/index.less";
import "../styles/viewer.less";
import { ScrollMode } from "../types";
interface PDFViewerProps {
    errorComponent?: ((reason: any) => ReactNode) | ReactNode;
    loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
    width: string | number;
    height: string | number;
    scrollMode?: ScrollMode;
}
declare const PDFViewer: FC<PDFViewerProps>;
export default PDFViewer;
