import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FC, useEffect, useRef, useState } from "react";

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
    const printUnits = 150 / 72;
    canvasEl.height = Math.floor(height * printUnits);
    canvasEl.width = Math.floor(width * printUnits);

    const transform =
      printUnits !== 1 ? [printUnits, 0, 0, printUnits, 0, 0] : undefined;


    if (context) {
      context.save();
      context.fillStyle = "rgb(255, 255, 255)";
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);
      context.restore();

      renderTask.current = pageDoc.render({
        canvasContext: context,
        viewport: viewport,
        intent: "print",
        transform: transform,
      });

      renderTask.current.promise.then(
        () => {
          if ('toBlob' in canvasEl && 'createObjectURL' in URL) {
            canvasEl.toBlob((blob) => {
              blob && setImgURI(URL.createObjectURL(blob));
            });
          } else {
            setImgURI(canvasEl.toDataURL());
          }
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
