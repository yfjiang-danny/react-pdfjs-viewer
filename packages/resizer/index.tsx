import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useRectObserver } from "../hooks/useRectObserver";
import { PageSize, ScaleType } from "../types";
import { Horizontal_PADDING, VERTICAL_PADDING } from "../types/constant";
import { PDFLib } from "../vendors/lib";

interface ResizerProps {
  doc: PDFDocumentProxy;
  scale: ScaleType;
  children: (rect: PageSize) => ReactNode;
}

const Resizer: React.FunctionComponent<ResizerProps> = ({
  doc,
  scale,
  children,
}) => {
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>({
    width: 0,
    height: 0,
    scale: 1,
  });

  const { width, height } = useRectObserver({
    elRef: resizerRef,
  });

  useEffect(() => {
    if (typeof scale === "string") {
      doc.getPage(1).then((page) => {
        const viewport = page.getViewport({
          scale: 1,
        });
        switch (scale) {
          case "fitHeight": {
            const pageScale = (height - Horizontal_PADDING) / viewport.height;
            setPageSize({
              height: height - Horizontal_PADDING,
              scale: pageScale,
              width: viewport.width * pageScale,
            });
            break;
          }
          case "fitWidth": {
            const pageScale = (width - VERTICAL_PADDING) / viewport.width;
            setPageSize({
              height: viewport.height * pageScale,
              scale: pageScale,
              width: width - VERTICAL_PADDING,
            });
            break;
          }
          default:
        }
      });
    }
  }, []);

  return (
    <div ref={resizerRef}>
      {pageSize.width == 0 ? null : children(pageSize)}
    </div>
  );
};

export default Resizer;
