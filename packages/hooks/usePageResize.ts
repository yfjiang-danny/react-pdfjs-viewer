import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { useState, useEffect } from "react";
import { PageSize, ScaleType } from "../types";
import {
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
  MIN_SCALE,
} from "../types/constant";
import { useRectObserver } from "./useRectObserver";

interface PageResizerProps {
  doc?: PDFDocumentProxy;
  scale: ScaleType;
  resizerRef: React.MutableRefObject<HTMLDivElement | null>;
}

function usePageResizer({ resizerRef, doc, scale }: PageResizerProps) {
  const [pageSize, setPageSize] = useState<PageSize>({
    width: 0,
    height: 0,
    scale: 1,
  });

  const { width, height } = useRectObserver({
    elRef: resizerRef,
  });

  useEffect(() => {
    if (!doc) {
      return;
    }
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({
        scale: 1,
      });
      let h = 0;
      let w = 0;
      let pageScale = 1;
      if (typeof scale === "string") {
        const horizontalPadding = HORIZONTAL_PADDING * 2;
        const verticalPadding = VERTICAL_PADDING * 2;
        switch (scale) {
          case "fitHeight": {
            pageScale = (height - verticalPadding) / viewport.height;
            h = height - verticalPadding;
            w = viewport.width * pageScale;
            break;
          }
          case "fitWidth": {
            pageScale = (width - horizontalPadding) / viewport.width;
            h = viewport.height * pageScale;
            w = width - horizontalPadding;
            break;
          }
          default: {
            const heightScale = (height - verticalPadding) / viewport.height;
            const widthScale = (width - horizontalPadding) / viewport.width;
            pageScale = Math.min(heightScale, widthScale);
            h = viewport.height * pageScale;
            w = viewport.width * pageScale;
          }
        }
      } else {
        pageScale = scale < MIN_SCALE ? MIN_SCALE : scale;
        w = viewport.height * pageScale;
        h = viewport.height * pageScale;
      }
      const newPageSize = {
        height: Math.floor(h),
        width: Math.floor(w),
        scale: pageScale,
      };
      setPageSize((pre) => {
        if (JSON.stringify(pre) == JSON.stringify(newPageSize)) {
          return pre;
        }
        return newPageSize;
      });
    });
  }, [doc, width, height, scale]);

  return pageSize;
}

export { usePageResizer };
