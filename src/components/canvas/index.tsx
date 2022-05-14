import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import PDFViewerContainer from "../../containers/container";
import {
  MAX_AUTO_SCALE,
  ScaleType,
  SCROLLBAR_PADDING,
  VERTICAL_PADDING,
} from "../../type";

interface PDFCanvasProps {
  pageDoc: PDFPageProxy;
  pageIndex: number;
}

const PDFCanvas: React.FunctionComponent<PDFCanvasProps> = (props) => {
  const { pageDoc, pageIndex } = props;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<any>();

  const { currentPage, currentScale, actualViewport, containerEl } =
    PDFViewerContainer.useContainer();

  function getScaleFactor(): [number, number] {
    if (actualViewport && containerEl) {
      const clientHeight = containerEl.clientHeight;
      console.log("containerEl.clientWidth", containerEl.clientWidth);
      console.log(" actualViewport.width", actualViewport.width);

      return [
        (containerEl.clientWidth - SCROLLBAR_PADDING) / actualViewport.width,
        (clientHeight - VERTICAL_PADDING) / actualViewport.height,
      ];
    }
    return [1, 1];
  }

  function getScale(scale: ScaleType): number {
    if (typeof scale === "number") {
      return scale;
    }
    switch (scale) {
      case "auto":
        return Math.min(getScaleFactor()[0], MAX_AUTO_SCALE);
      case "fitWidth":
        return getScaleFactor()[0];
      case "fitHeight":
        return getScaleFactor()[1];
      default:
        return 1;
    }
  }

  function update() {
    // createPromiseCapability()
    if (canvasRef.current) {
      if (renderTask.current) {
        renderTask.current.cancel();
      }

      var viewport = pageDoc.getViewport({ scale: getScale(currentScale) });

      var context = canvasRef.current.getContext("2d");

      canvasRef.current.height = viewport.height;
      canvasRef.current.width = viewport.width;
      canvasRef.current.hidden = true;

      if (context) {
        renderTask.current = pageDoc.render({
          canvasContext: context,
          viewport: viewport,
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
  }

  function onResize() {
    console.log(11111111111);
    console.log("currentScale", currentScale);

    if (isNaN(Number(currentScale))) {
      update();
    }
  }

  useLayoutEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDoc, currentScale]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScale]);

  useEffect(() => {
    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
        renderTask.current = undefined;
      }
    };
  }, []);

  return (
    <div>
      <canvas key={pageIndex} ref={canvasRef} />
    </div>
  );
};

export default PDFCanvas;
