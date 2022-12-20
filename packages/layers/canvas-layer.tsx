import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { FunctionComponent, useEffect, useRef } from "react";
import "../styles/canvas-layer.less";

interface CanvasLayerProps {
  pageDoc: PDFPageProxy;
  pageIndex: number;
  renderingIndex: number;
  width: number;
  height: number;
  scale: number;
  onCompleted(): void;
}

const CanvasLayer: FunctionComponent<CanvasLayerProps> = (props) => {
  const {
    pageDoc,
    pageIndex,
    renderingIndex,
    width,
    height,
    scale,
    onCompleted,
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTask = useRef<any>();

  function refresh(width: number, height: number): void {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${Math.floor(width)}px`;
      canvasRef.current.style.height = `${Math.floor(height)}px`;
      canvasRef.current.style.transform = `scale(1,1)`;
    }
  }

  function showCanvas(canvasEl: HTMLCanvasElement): void {
    if (wrapperRef.current) {
      canvasEl.hidden = false;
      wrapperRef.current.appendChild(canvasEl);
      canvasRef.current && wrapperRef.current?.removeChild(canvasRef.current);
      canvasRef.current = canvasEl;
    }
  }

  useEffect(() => {
    if (renderingIndex !== pageIndex) {
      return;
    }

    if (renderTask.current) {
      renderTask.current.cancel();
    }

    const viewport = pageDoc.getViewport({ scale });
    refresh(viewport.width, viewport.height);

    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;

    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");

    canvasEl.height = Math.floor(viewport.height * outputScale);
    canvasEl.width = Math.floor(viewport.width * outputScale);
    canvasEl.style.width = `${Math.floor(viewport.width)}px`;
    canvasEl.style.height = `${Math.floor(viewport.height)}px`;
    canvasEl.style.position = "absolute";
    canvasEl.style.top = "0";
    canvasEl.style.left = "0";
    canvasEl.style.bottom = "0";
    canvasEl.style.right = "0";
    canvasEl.hidden = true;

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
          showCanvas(canvasEl);
          onCompleted?.();
        },
        () => {
          showCanvas(canvasEl);
          onCompleted?.();
        }
      );
    }
  }, [pageDoc, scale, width, height, renderingIndex]);

  return (
    <div
      className="canvas-layer"
      style={{ width: width, height: height }}
      ref={wrapperRef}
    >
      {/* <canvas key={pageIndex} ref={canvasRef} /> */}
    </div>
  );
};

export default CanvasLayer;
