import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FC } from "react";
import "../styles/thumbnail.less";
interface ThumbnailProps {
    pdfDoc?: PDFDocumentProxy;
    currentPage: number;
}
declare const Thumbnail: FC<ThumbnailProps>;
export default Thumbnail;
