import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { FC } from "react";
interface ThumbnailItemProps {
    pdfDoc: PDFDocumentProxy;
    pageIndex: number;
    width: number;
    height: number;
    scale: number;
}
declare const ThumbnailItem: FC<ThumbnailItemProps>;
export default ThumbnailItem;
