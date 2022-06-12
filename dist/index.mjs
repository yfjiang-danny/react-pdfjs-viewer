var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// packages/layers/canvas-layer.tsx
import React, { useEffect, useRef } from "react";
var CanvasLayer = (props) => {
  const { pageDoc, pageIndex, width, height, scale, onCompleted } = props;
  const canvasRef = useRef(null);
  const renderTask = useRef();
  useEffect(() => {
    if (canvasRef.current) {
      if (renderTask.current) {
        renderTask.current.cancel();
      }
      console.log("scale", scale);
      var viewport = pageDoc.getViewport({ scale });
      var outputScale = window.devicePixelRatio || 1;
      var context = canvasRef.current.getContext("2d");
      canvasRef.current.height = Math.floor(viewport.height * outputScale);
      canvasRef.current.width = Math.floor(viewport.width * outputScale);
      canvasRef.current.style.width = `${Math.floor(viewport.width)}px`;
      canvasRef.current.style.height = `${Math.floor(viewport.height)}px`;
      canvasRef.current.hidden = true;
      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : void 0;
      if (context) {
        renderTask.current = pageDoc.render({
          canvasContext: context,
          viewport,
          transform
        });
        renderTask.current.promise.then(() => {
          if (canvasRef.current) {
            canvasRef.current.hidden = false;
          }
          onCompleted == null ? void 0 : onCompleted();
        }, () => {
          if (canvasRef.current) {
            canvasRef.current.hidden = false;
          }
          onCompleted == null ? void 0 : onCompleted();
        });
      }
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, [pageDoc, scale, width, height]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "canvas-layer",
    style: { width, height }
  }, /* @__PURE__ */ React.createElement("canvas", {
    key: pageIndex,
    ref: canvasRef
  }));
};
var canvas_layer_default = CanvasLayer;

// packages/layers/svg-layer.tsx
import React2 from "react";
var SvgLayer = (props) => {
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, "SvgLayer Component");
};
var svg_layer_default = SvgLayer;

// packages/layers/text-layer.tsx
import React3, { useEffect as useEffect2, useRef as useRef2 } from "react";

// packages/vendors/lib.ts
import * as PDFLib from "pdfjs-dist";

// packages/layers/text-layer.tsx
var TextLayer = (props) => {
  const { pageDoc, pageIndex, width, height, scale } = props;
  const textContainerRef = useRef2(null);
  const renderTask = useRef2(null);
  useEffect2(() => {
    if (renderTask.current) {
      renderTask.current.cancel();
    }
    if (textContainerRef.current) {
      const viewport = pageDoc.getViewport({ scale });
      pageDoc.getTextContent().then((textContent) => {
        if (textContent && textContainerRef.current) {
          renderTask.current = PDFLib.renderTextLayer({
            container: textContainerRef.current,
            viewport,
            textContent
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
  return /* @__PURE__ */ React3.createElement("div", {
    ref: textContainerRef,
    style: {
      width,
      height
    },
    className: "text-layer"
  });
};
var text_layer_default = TextLayer;

// packages/viewer/index.tsx
import { range } from "lodash";
import React5, { useEffect as useEffect6, useRef as useRef4, useState as useState5 } from "react";

// packages/layers/page-layer.tsx
import React4, {
  useEffect as useEffect3,
  useState as useState2
} from "react";
var PageLayer = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode
}) => {
  const [pageDoc, setPageDoc] = useState2();
  useEffect3(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, pageDoc ? /* @__PURE__ */ React4.createElement("div", {
    className: `page-layer ${scrollMode}-scroll`,
    id: `__page_${pageIndex}__`,
    style: {
      height,
      width
    }
  }, children(pageDoc)) : null);
};
var page_layer_default = PageLayer;

// packages/hooks/usePageResize.ts
import { useState as useState4, useEffect as useEffect5 } from "react";

// packages/types/constant.ts
var MIN_SCALE = 0.1;
var VERTICAL_PADDING = 16;
var HORIZONTAL_PADDING = 24;

// packages/hooks/useRectObserver.ts
import { useEffect as useEffect4, useRef as useRef3, useState as useState3 } from "react";
function useRectObserver({ elRef }) {
  const [width, setWidth] = useState3(0);
  const [height, setHeight] = useState3(0);
  const observer = useRef3(null);
  function resizeObserver(entries) {
    for (const entry of entries) {
      const { width: width2, height: height2 } = entry.contentRect;
      setWidth(width2);
      setHeight(height2);
    }
  }
  useEffect4(() => {
    if (elRef.current) {
      observer.current = new ResizeObserver(resizeObserver);
      observer.current.observe(elRef.current);
    }
    return () => {
      if (elRef.current && observer.current) {
        observer.current.unobserve(elRef.current);
        observer.current.disconnect();
      }
    };
  }, []);
  return {
    height,
    width
  };
}

// packages/hooks/usePageResize.ts
function usePageResizer({ resizerRef, doc, scale }) {
  const [pageSize, setPageSize] = useState4({
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizerRef
  });
  useEffect5(() => {
    if (!doc) {
      return;
    }
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({
        scale: 1
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
        scale: pageScale
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

// packages/viewer/index.tsx
var PDFViewer = ({
  pdfURI,
  loadingComponent,
  errorComponent,
  scale,
  width,
  height,
  scrollMode = "vertical"
}) => {
  const [loading, setLoading] = useState5(false);
  const [loadingProgress, setLoadingProgress] = useState5(-1);
  const [pdfDoc, setPDFDoc] = useState5();
  const [errorReason, setErrorReason] = useState5();
  const loadingTask = useRef4(null);
  const viewerRef = useRef4(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState5(-1);
  const pageSize = usePageResizer({
    resizerRef: viewerRef,
    doc: pdfDoc,
    scale
  });
  useEffect6(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);
  useEffect6(() => {
    if (pdfURI) {
      loadingTask.current = PDFLib.getDocument(pdfURI);
      loadingTask.current.onProgress = (progress) => {
        setLoadingProgress(progress);
      };
      loadingTask.current.promise.then((pdf) => {
        setPDFDoc(pdf);
      }).catch((reason) => {
        setErrorReason(reason);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [pdfURI]);
  function contentComponent() {
    if (!pdfURI) {
      return "\u8BF7\u8F93\u5165 PDF";
    }
    if (loading) {
      return typeof loadingComponent == "function" ? loadingComponent(loadingProgress) : loadingComponent;
    }
    if (errorReason || !pdfDoc) {
      return typeof errorComponent == "function" ? errorComponent(errorReason) : errorComponent;
    }
    return /* @__PURE__ */ React5.createElement("div", null, pageSize.width == 0 ? null : range(0, pdfDoc.numPages - 1).map((index) => {
      const pageIndex = index + 1;
      return /* @__PURE__ */ React5.createElement(page_layer_default, __spreadProps(__spreadValues({
        key: index,
        pageIndex,
        doc: pdfDoc
      }, pageSize), {
        scrollMode
      }), (doc) => renderingPageIndex < pageIndex ? null : [
        /* @__PURE__ */ React5.createElement(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex,
          key: `canvas_layer_${pageIndex}`,
          onCompleted: () => {
            setRenderingPageIndex((pre) => pre + 1);
          }
        })),
        /* @__PURE__ */ React5.createElement(text_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex,
          key: `text_layer_${pageIndex}`
        }))
      ]);
    }));
  }
  return /* @__PURE__ */ React5.createElement("div", {
    id: "pdf_viewer_container",
    className: "viewer",
    style: { height, width },
    ref: viewerRef
  }, contentComponent());
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
import React6 from "react";
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, children);
};
var worker_default = PDFWorker;
export {
  canvas_layer_default as CanvasLayer,
  viewer_default as PDFViewer,
  worker_default as PDFWorker,
  svg_layer_default as SVGLayer,
  text_layer_default as TextLayer
};
//# sourceMappingURL=index.mjs.map
