import { PDFPageProxy, TextContent } from "pdfjs-dist/types/display/api";
import { TextLayerRenderTask } from "pdfjs-dist/types/display/text_layer";
import React, { useEffect, useRef, useState } from "react";
import { PDFLib } from "../vendors/lib";

interface TextLayerProps {
  pageDoc: PDFPageProxy;
  pageIndex: number;
  scale: number;
}

const TextLayer: React.FunctionComponent<TextLayerProps> = (props) => {
  const { pageDoc, pageIndex, scale } = props;

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

    return () => {};
  }, []);

  return <div ref={textContainerRef} />;
};

export default TextLayer;
