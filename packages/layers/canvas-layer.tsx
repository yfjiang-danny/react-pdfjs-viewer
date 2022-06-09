import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FunctionComponent, useEffect, useRef } from "react";

interface CanvasLayerProps {
  pageDoc: PDFPageProxy;
  pageIndex: number;
  width: number;
  height: number;
  scale: number;
}

const CanvasLayer: FunctionComponent<CanvasLayerProps> = (props) => {
  const { pageDoc, pageIndex, width, height, scale } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<any>();

  useEffect(() => {
    if (canvasRef.current) {
      if (renderTask.current) {
        renderTask.current.cancel();
      }

      console.log("scale", scale);

      var viewport = pageDoc.getViewport({ scale });

      // Support HiDPI-screens.
      var outputScale = window.devicePixelRatio || 1;

      var context = canvasRef.current.getContext("2d");

      canvasRef.current.height = Math.floor(viewport.height * outputScale);
      canvasRef.current.width = Math.floor(viewport.width * outputScale);
      canvasRef.current.style.width = `${Math.floor(viewport.width)}px`;
      canvasRef.current.style.height = `${Math.floor(viewport.height)}px`;
      canvasRef.current.hidden = true;

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      if (context) {
        renderTask.current = pageDoc.render({
          canvasContext: context,
          viewport: viewport,
          transform: transform,
        });

        renderTask.current.promise.then(
          () => {
            if (canvasRef.current) {
              canvasRef.current.hidden = false;
            }
          },
          () => {
            if (canvasRef.current) {
              canvasRef.current.hidden = false;
            }
          }
        );
      }
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, [pageDoc, scale]);

  return (
    <div style={{ width: width, height: height }}>
      <canvas key={pageIndex} ref={canvasRef} />
    </div>
  );
};

export default CanvasLayer;
