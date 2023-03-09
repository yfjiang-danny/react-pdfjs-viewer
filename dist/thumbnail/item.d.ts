import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FC } from "react";
interface ThumbnailItemProps {
    pdfDoc: PDFDocumentProxy;
    pageIndex: number;
    currentPage: number;
}
declare const ThumbnailItem: FC<ThumbnailItemProps>;
export default ThumbnailItem;
