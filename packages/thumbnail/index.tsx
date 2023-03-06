import { range } from "lodash";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { FC, useEffect } from "react";
import { usePDFViewer } from "../provider";
import "../styles/thumbnail.less";
import { scrollIntoViewByID } from "../utils";
import ThumbnailItem from "./item";

interface ThumbnailProps {
  pdfDoc?: PDFDocumentProxy;
  currentPage: number;
}

const Thumbnail: FC<ThumbnailProps> = ({ pdfDoc, currentPage }) => {
  const { sidebarVisible } = usePDFViewer();

  useEffect(() => {
    sidebarVisible && scrollIntoViewByID(`thumbnail_page_${currentPage}`);
  }, [currentPage, sidebarVisible]);

  return (
    <div id="__thumbnail__">
      {!pdfDoc
        ? null
        : range(0, pdfDoc.numPages).map((index) => {
            const pageIndex = index + 1;
            return (
              <ThumbnailItem
                key={pageIndex}
                pdfDoc={pdfDoc}
                pageIndex={pageIndex}
                currentPage={currentPage}
              />
            );
          })}
    </div>
  );
};

export default Thumbnail;
