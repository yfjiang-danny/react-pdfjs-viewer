import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { useLayoutEffect } from "react";

interface PDFCanvasProps {
  pageDoc: PDFPageProxy;
  scale?: number;
}

const PDFCanvas: React.FunctionComponent<PDFCanvasProps> = (props) => {
  const { pageDoc, scale } = props;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      var viewport = pageDoc.getViewport({ scale: scale || 1 });

      var context = canvasRef.current.getContext("2d");

      canvasRef.current.height = viewport.height;
      canvasRef.current.width = viewport.width;

      context &&
        pageDoc.render({
          canvasContext: context,
          viewport: viewport,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDoc]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          transform: `scale(${1 / devicePixelRatio})`,
          transformOrigin: `top left`,
        }}
      />
    </div>
  );
};

export default PDFCanvas;
