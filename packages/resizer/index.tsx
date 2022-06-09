import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRectObserver } from "../hooks/useRectObserver";
import { PageSize, ScaleType } from "../types";
import { HORIZONTAL_PADDING, VERTICAL_PADDING } from "../types/constant";
import { PDFLib } from "../vendors/lib";

interface ResizerProps {
  doc: PDFDocumentProxy;
  scale: ScaleType;
  children: (rect: PageSize) => ReactNode;
}

const Resizer: FunctionComponent<ResizerProps> = ({ doc, scale, children }) => {
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
        pageScale = scale;
        w = viewport.height * pageScale;
        h = viewport.height * pageScale;
      }
      setPageSize({
        height: Math.floor(h),
        width: Math.floor(w),
        scale: pageScale,
      });
    });
  }, [doc, width, height, scale]);

  return (
    <div ref={resizerRef} style={{ width: "100%", height: "100%" }}>
      {pageSize.height == 0 || pageSize.width == 0 ? null : children(pageSize)}
    </div>
  );
};

export default Resizer;
