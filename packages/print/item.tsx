import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FC, useEffect, useRef, useState } from "react";

interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageIndex: number;
  width: number;
  height: number;
  scale: number;
}

const ThumbnailItem: FC<ThumbnailItemProps> = ({
  pdfDoc,
  pageIndex,
  width,
  height,
  scale,
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

    const viewport = pageDoc.getViewport({ scale: scale });
    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");

    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;
    canvasEl.height = Math.floor(height * outputScale);
    canvasEl.width = Math.floor(width * outputScale);
    canvasEl.style.width = `${Math.floor(width * outputScale)}px`;
    canvasEl.style.height = `${Math.floor(height * outputScale)}px`;

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
        intent: "print",
        transform: transform,
      });

      renderTask.current.promise.then(
        () => {
          if (context) {
            context.drawImage(
              canvasEl,
              0,
              0,
              viewport.width,
              viewport.height,
              0,
              0,
              width * outputScale,
              height * outputScale
            );
          }
          setImgURI(canvasEl.toDataURL());
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
