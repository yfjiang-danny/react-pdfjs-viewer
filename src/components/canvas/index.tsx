import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { useLayoutEffect } from "react";
import PDFViewerContainer from "../../containers/container";

interface PDFCanvasProps {
  pageDoc: PDFPageProxy;
}

const PDFCanvas: React.FunctionComponent<PDFCanvasProps> = (props) => {
  const { pageDoc } = props;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { currentScale } = PDFViewerContainer.useContainer();

  useLayoutEffect(() => {
    if (canvasRef.current) {
      var viewport = pageDoc.getViewport({ scale: currentScale });

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
  }, [pageDoc, currentScale]);

  return (
    <div>
      <canvas
        ref={canvasRef}
      />
    </div>
  );
};

export default PDFCanvas;
