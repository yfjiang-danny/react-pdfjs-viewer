import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FC, useEffect, useRef, useState } from "react";
import { TempImageFactory } from "../thumbnail/util";

interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageIndex: number;
  width: number;
  height: number;
}

const ThumbnailItem: FC<ThumbnailItemProps> = ({
  pdfDoc,
  pageIndex,
  width,
  height,
}) => {
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

    const thumbWidth = width;
    const thumbHeight = width * pageRatio;

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

  return (
    <div ref={rootRef} id={`print_page_${pageIndex}`} className={`print-item`}>
      {imgURI ? <img src={imgURI} /> : null}
    </div>
  );
};

export default ThumbnailItem;
