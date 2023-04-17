import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { useEffect, useState } from "react";
import { PageSize, ScaleType } from "../types";
import {
  HORIZONTAL_PADDING,
  MAX_SCALE,
  MIN_SCALE,
  VERTICAL_PADDING,
} from "../types/constant";
import { useRectObserver } from "./useRectObserver";

interface PageResizesProps {
  doc?: PDFDocumentProxy;
  scale: ScaleType;
  resizesRef: React.MutableRefObject<HTMLDivElement | null>;
}

function usePageResizes({ resizesRef, doc, scale }: PageResizesProps) {
  const [pageSize, setPageSize] = useState<PageSize>({
    vWidth: 0,
    vHeight: 0,
    width: 0,
    height: 0,
    scale: 1,
  });

  const { width, height } = useRectObserver({
    elRef: resizesRef,
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
        pageScale =
          scale < MIN_SCALE ? MIN_SCALE : scale > MAX_SCALE ? MAX_SCALE : scale;
        w = viewport.width * pageScale;
        h = viewport.height * pageScale;
      }
      const newPageSize = {
        vWidth: viewport.width,
        vHeight: viewport.height,
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

export { usePageResizes };
