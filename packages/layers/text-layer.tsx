import { PDFPageProxy, TextContent } from "pdfjs-dist/types/display/api";
import { TextLayerRenderTask } from "pdfjs-dist/types/display/text_layer";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { PDFLib } from "../vendors/lib";
import "../styles/text-layer.less";

interface TextLayerProps {
  pageDoc: PDFPageProxy;
  pageIndex: number;
  width: number;
  height: number;
  scale: number;
}

const TextLayer: FunctionComponent<TextLayerProps> = (props) => {
  const { pageDoc, pageIndex, width, height, scale } = props;

  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const renderTask = useRef<TextLayerRenderTask | null>(null);

  useEffect(() => {
    if (renderTask.current) {
      renderTask.current.cancel();
    }
    if (textContainerRef.current) {
      const viewport = pageDoc.getViewport({ scale });

      pageDoc.getTextContent().then((textContent) => {
        if (textContent && textContainerRef.current) {
          renderTask.current = PDFLib.renderTextLayer({
            container: textContainerRef.current,
            viewport: viewport,
            textContent: textContent,
          });
        }
      });
    }

    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
      }
    };
  }, [pageDoc, scale, width, height]);

  return (
    <div
      ref={textContainerRef}
      style={{
        width: width,
        height: height,
      }}
      className="text-layer"
    />
  );
};

export default TextLayer;
