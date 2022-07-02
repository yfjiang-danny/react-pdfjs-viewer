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
  const {
    pageDoc,
    pageIndex,
    renderingIndex,
    width,
    height,
    scale,
    onCompleted
  } = props;
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTask = useRef();
  function refresh(width2, height2) {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${Math.floor(width2)}px`;
      canvasRef.current.style.height = `${Math.floor(height2)}px`;
      canvasRef.current.style.transform = `scale(1,1)`;
    }
  }
  function showCanvas(canvasEl) {
    var _a;
    if (wrapperRef.current) {
      canvasEl.hidden = false;
      wrapperRef.current.appendChild(canvasEl);
      canvasRef.current && ((_a = wrapperRef.current) == null ? void 0 : _a.removeChild(canvasRef.current));
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
    console.log(renderingIndex, pageIndex);
    var viewport = pageDoc.getViewport({ scale });
    refresh(viewport.width, viewport.height);
    var outputScale = window.devicePixelRatio || 1;
    const canvasEl = document.createElement("canvas");
    var context = canvasEl.getContext("2d");
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
    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : void 0;
    if (context) {
      renderTask.current = pageDoc.render({
        canvasContext: context,
        viewport,
        transform
      });
      renderTask.current.promise.then(() => {
        showCanvas(canvasEl);
        onCompleted == null ? void 0 : onCompleted();
      }, () => {
        showCanvas(canvasEl);
        onCompleted == null ? void 0 : onCompleted();
      });
    }
  }, [pageDoc, scale, width, height, renderingIndex]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "canvas-layer",
    style: { width, height },
    ref: wrapperRef
  });
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
import React6, { useEffect as useEffect6, useRef as useRef4, useState as useState5 } from "react";

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

// packages/layers/loading-layer.tsx
import React5 from "react";
var LoadingLayer = (props) => {
  return /* @__PURE__ */ React5.createElement("div", {
    className: "loading-layer"
  });
};
var loading_layer_default = LoadingLayer;

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
  const [renderingPageIndex, setRenderingPageIndex] = useState5(1);
  const [renderMap, setRenderMap] = useState5({});
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
    return /* @__PURE__ */ React6.createElement("div", null, pageSize.width == 0 ? null : range(0, pdfDoc.numPages).map((index) => {
      const pageIndex = index + 1;
      return /* @__PURE__ */ React6.createElement(page_layer_default, __spreadProps(__spreadValues({
        key: index,
        pageIndex,
        doc: pdfDoc
      }, pageSize), {
        scrollMode
      }), (doc) => renderingPageIndex < pageIndex && !renderMap[pageIndex] ? /* @__PURE__ */ React6.createElement(loading_layer_default, null) : [
        /* @__PURE__ */ React6.createElement(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex,
          renderingIndex: renderingPageIndex,
          key: `canvas_layer_${pageIndex}`,
          onCompleted: () => {
            setRenderingPageIndex((pre) => pre + 1);
          }
        })),
        /* @__PURE__ */ React6.createElement(text_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex,
          key: `text_layer_${pageIndex}`
        })),
        renderingPageIndex <= pageIndex ? /* @__PURE__ */ React6.createElement(loading_layer_default, {
          key: `loading_layer_${pageIndex}`
        }) : null
      ]);
    }));
  }
  return /* @__PURE__ */ React6.createElement("div", {
    id: "pdf_viewer_container",
    className: "viewer",
    style: { height, width },
    ref: viewerRef
  }, contentComponent());
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
import React7 from "react";
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ React7.createElement(React7.Fragment, null, children);
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
