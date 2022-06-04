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
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({
        scale: 1,
      });
      if (typeof scale === "string") {
        const horizontalPadding = Horizontal_PADDING * 2;
        const verticalPadding = VERTICAL_PADDING * 2;
        switch (scale) {
          case "fitHeight": {
            const pageScale = (height - horizontalPadding) / viewport.height;
            setPageSize({
              height: height - horizontalPadding,
              scale: pageScale,
              width: viewport.width * pageScale,
            });
            break;
          }
          case "fitWidth": {
            const pageScale = (width - verticalPadding) / viewport.width;
            setPageSize({
              height: viewport.height * pageScale,
              scale: pageScale,
              width: width - verticalPadding,
            });
            break;
          }
          default: {
            const heightScale = (height - horizontalPadding) / viewport.height;
            const widthScale = (width - verticalPadding) / viewport.width;
            const pageScale = Math.min(heightScale, widthScale);
            setPageSize({
              height: viewport.height * pageScale,
              scale: pageScale,
              width: viewport.width * pageScale,
            });
          }
        }
      } else {
        setPageSize({
          width: viewport.height * scale,
          height: viewport.height * scale,
          scale: scale,
        });
      }
    });
  }, [doc, width, height, scale]);

  return (
    <div ref={resizerRef}>
      {pageSize.width == 0 ? null : children(pageSize)}
    </div>
  );
};

export default Resizer;
