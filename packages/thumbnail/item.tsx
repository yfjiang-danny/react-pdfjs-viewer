import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FC, useEffect, useRef, useState } from "react";
import { usePDFViewer } from "../provider";
import { THUMBNAIL_WIDTH } from "../types/constant";
import { scrollToPageIndex } from "../utils";
import { TempImageFactory } from "./util";

interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageIndex: number;
  currentPage: number;
}

const ThumbnailItem: FC<ThumbnailItemProps> = ({ pdfDoc, pageIndex }) => {
  const { currentPage, setCurrentPage } = usePDFViewer();

  const [pageDoc, setPageDoc] = useState<PDFPageProxy>();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const renderTask = useRef<any>(null);
  const [imgURI, setImgURI] = useState<string>();

  useEffect(() => {
    pdfDoc.getPage(pageIndex).then((pageDoc) => {
      setPageDoc(pageDoc);
    });
  }, [pageIndex, pdfDoc]);

  useEffect(() => {
    if (!pageDoc) return;

    const viewport = pageDoc.getViewport({ scale: 1 });
    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");

    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;
    canvasEl.height = Math.floor(viewport.height * outputScale);
    canvasEl.width = Math.floor(viewport.width * outputScale);
    canvasEl.style.width = `${Math.floor(viewport.width)}px`;
    canvasEl.style.height = `${Math.floor(viewport.height)}px`;

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    const pageWidth = viewport.width,
      pageHeight = viewport.height,
      pageRatio = pageWidth / pageHeight;

    const thumbWidth = THUMBNAIL_WIDTH;
    const thumbHeight = THUMBNAIL_WIDTH / pageRatio;

    if (context) {
      renderTask.current = pageDoc.render({
        canvasContext: context,
        viewport: viewport,
        transform: transform,
      });

      renderTask.current.promise.then(
        () => {
          const [canvas, ctx] = TempImageFactory.getCanvas(
            thumbWidth,
            thumbHeight
          );
          if (ctx) {
            ctx.drawImage(
              canvasEl,
              0,
              0,
              viewport.width,
              viewport.height,
              0,
              0,
              thumbWidth,
              thumbHeight
            );
          }
          setImgURI(canvas.toDataURL());
          // onCompleted?.();
        },
        () => {
          // onCompleted?.();
        }
      );
    }

    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
        renderTask.current = null;
      }
    };
  }, [pageDoc]);

  const selectionClassName = "selection";
  useEffect(() => {
    if (rootRef.current) {
      if (pageIndex == currentPage) {
        !rootRef.current.classList.contains(selectionClassName) &&
          rootRef.current.classList.add(selectionClassName);
      } else {
        rootRef.current.classList.contains(selectionClassName) &&
          rootRef.current.classList.remove(selectionClassName);
      }
    }
  }, [currentPage, pageIndex]);

  return (
    <div
      ref={rootRef}
      id={`thumbnail_page_${pageIndex}`}
      className={`thumbnail-item`}
      onClick={() => {
        setCurrentPage(pageIndex);
        scrollToPageIndex(pageIndex);
      }}
    >
      {imgURI ? <img src={imgURI} /> : null}
      <div
        className="thumbnail-item-page-mask"
        title={`第${pageIndex}页`}
        data-num={pageIndex}
      />
    </div>
  );
};

export default ThumbnailItem;
