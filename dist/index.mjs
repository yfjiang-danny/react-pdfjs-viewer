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
  const { pageDoc, pageIndex, width, height, scale } = props;
  const canvasRef = useRef(null);
  const renderTask = useRef();
  useEffect(() => {
    if (canvasRef.current) {
      if (renderTask.current) {
        renderTask.current.cancel();
      }
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
        }, () => {
          if (canvasRef.current) {
            canvasRef.current.hidden = false;
          }
        });
      }
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ React.createElement("canvas", {
    key: pageIndex,
    ref: canvasRef
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
  const { pageDoc, pageIndex, scale } = props;
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
    };
  }, []);
  return /* @__PURE__ */ React3.createElement("div", {
    ref: textContainerRef
  });
};
var text_layer_default = TextLayer;

// packages/viewer/index.tsx
import { range } from "lodash";
import React6, { useEffect as useEffect6, useRef as useRef5, useState as useState5 } from "react";

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
  children
}) => {
  const [pageDoc, setPageDoc] = useState2();
  useEffect3(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, pageDoc ? /* @__PURE__ */ React4.createElement("div", {
    id: `__page_${pageIndex}__`,
    style: { height, width }
  }, children(pageDoc)) : null);
};
var page_layer_default = PageLayer;

// packages/resizer/index.tsx
import React5, {
  useEffect as useEffect5,
  useRef as useRef4,
  useState as useState4
} from "react";

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

// packages/types/constant.ts
var VERTICAL_PADDING = 5;
var Horizontal_PADDING = 5;

// packages/resizer/index.tsx
var Resizer = ({ doc, scale, children }) => {
  const resizerRef = useRef4(null);
  const [pageSize, setPageSize] = useState4({
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizerRef
  });
  useEffect5(() => {
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({
        scale: 1
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
              width: viewport.width * pageScale
            });
            break;
          }
          case "fitWidth": {
            const pageScale = (width - verticalPadding) / viewport.width;
            setPageSize({
              height: viewport.height * pageScale,
              scale: pageScale,
              width: width - verticalPadding
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
              width: viewport.width * pageScale
            });
          }
        }
      } else {
        setPageSize({
          width: viewport.height * scale,
          height: viewport.height * scale,
          scale
        });
      }
    });
  }, [doc, width, height, scale]);
  return /* @__PURE__ */ React5.createElement("div", {
    ref: resizerRef
  }, pageSize.width == 0 ? null : children(pageSize));
};
var resizer_default = Resizer;

// packages/viewer/index.tsx
var PDFViewer = ({
  pdfURI,
  loadingComponent,
  errorComponent,
  scale
}) => {
  const [loading, setLoading] = useState5(false);
  const [loadingProgress, setLoadingProgress] = useState5(-1);
  const [pdfDoc, setPDFDoc] = useState5();
  const [errorReason, setErrorReason] = useState5();
  const loadingTask = useRef5(null);
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
    return /* @__PURE__ */ React6.createElement(resizer_default, {
      doc: pdfDoc,
      scale
    }, (pageSize) => /* @__PURE__ */ React6.createElement(React6.Fragment, null, range(0, pdfDoc.numPages - 1).map((index) => {
      return /* @__PURE__ */ React6.createElement(page_layer_default, __spreadValues({
        key: index,
        pageIndex: index + 1,
        doc: pdfDoc
      }, pageSize), (doc) => [
        /* @__PURE__ */ React6.createElement(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex: index
        }))
      ]);
    })));
  }
  return /* @__PURE__ */ React6.createElement("div", {
    id: "pdf_viewer_container",
    className: "pdf-viewer-container"
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
