"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/index.ts
var packages_exports = {};
__export(packages_exports, {
  CanvasLayer: () => canvas_layer_default,
  PDFViewer: () => viewer_default,
  PDFViewerProvider: () => PDFViewerProvider,
  PDFWorker: () => worker_default,
  SVGLayer: () => svg_layer_default,
  TextLayer: () => text_layer_default,
  Toolbar: () => toolbar_default,
  usePDFViewer: () => usePDFViewer
});
module.exports = __toCommonJS(packages_exports);

// packages/layers/canvas-layer.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const wrapperRef = (0, import_react.useRef)(null);
  const canvasRef = (0, import_react.useRef)(null);
  const renderTask = (0, import_react.useRef)();
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
  (0, import_react.useEffect)(() => {
    if (renderingIndex !== pageIndex) {
      return;
    }
    if (renderTask.current) {
      renderTask.current.cancel();
    }
    const viewport = pageDoc.getViewport({ scale });
    refresh(viewport.width, viewport.height);
    const outputScale = window.devicePixelRatio || 1;
    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");
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
      renderTask.current.promise.then(
        () => {
          showCanvas(canvasEl);
          onCompleted == null ? void 0 : onCompleted();
        },
        () => {
          showCanvas(canvasEl);
          onCompleted == null ? void 0 : onCompleted();
        }
      );
    }
  }, [pageDoc, scale, width, height, renderingIndex]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "canvas-layer",
    style: { width, height },
    ref: wrapperRef
  });
};
var canvas_layer_default = CanvasLayer;

// packages/layers/svg-layer.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SvgLayer = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: "SvgLayer Component"
  });
};
var svg_layer_default = SvgLayer;

// packages/layers/text-layer.tsx
var import_react2 = require("react");

// packages/vendors/lib.ts
var PDFLib = __toESM(require("pdfjs-dist"), 1);

// packages/layers/text-layer.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var TextLayer = (props) => {
  const { pageDoc, pageIndex, width, height, scale } = props;
  const textContainerRef = (0, import_react2.useRef)(null);
  const renderTask = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
var import_lodash = require("lodash");
var import_react8 = require("react");

// packages/hooks/usePageResize.ts
var import_react4 = require("react");

// packages/types/constant.ts
var MIN_SCALE = 0.1;
var MAX_SCALE = 10;
var VERTICAL_PADDING = 16;
var HORIZONTAL_PADDING = 24;

// packages/hooks/useRectObserver.ts
var import_react3 = require("react");
function useRectObserver({ elRef }) {
  const [width, setWidth] = (0, import_react3.useState)(0);
  const [height, setHeight] = (0, import_react3.useState)(0);
  const observer = (0, import_react3.useRef)(null);
  function resizeObserver(entries) {
    for (const entry of entries) {
      const { width: width2, height: height2 } = entry.contentRect;
      setWidth(width2);
      setHeight(height2);
    }
  }
  (0, import_react3.useEffect)(() => {
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
function usePageResizes({ resizesRef, doc, scale }) {
  const [pageSize, setPageSize] = (0, import_react4.useState)({
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizesRef
  });
  (0, import_react4.useEffect)(() => {
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
        pageScale = scale < MIN_SCALE ? MIN_SCALE : scale > MAX_SCALE ? MAX_SCALE : scale;
        w = viewport.width * pageScale;
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

// packages/layers/loading-layer.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var LoadingLayer = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "loading-layer"
  });
};
var loading_layer_default = LoadingLayer;

// packages/layers/page-layer.tsx
var import_react5 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var PageLayer = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode
}) => {
  const [pageDoc, setPageDoc] = (0, import_react5.useState)();
  (0, import_react5.useEffect)(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: pageDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      className: `page-layer ${scrollMode}-scroll`,
      id: `__page_${pageIndex}__`,
      style: {
        height,
        width
      },
      children: children(pageDoc)
    }) : null
  });
};
var page_layer_default = PageLayer;

// packages/provider/index.tsx
var import_react7 = __toESM(require("react"), 1);

// packages/provider/internal.ts
var import_react6 = __toESM(require("react"), 1);
function useInternalStateHook() {
  const scaleNumberRef = (0, import_react6.useRef)(1);
  return {
    scaleNumberRef
  };
}
var InternalStateContext = import_react6.default.createContext(null);
function useInternalState() {
  const state = import_react6.default.useContext(InternalStateContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

// packages/provider/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function usePDFViewerHook(initialState = {
  scale: "auto",
  page: 0,
  pdfURI: ""
}) {
  const [pdfURI, setPdfURI] = (0, import_react7.useState)(initialState.pdfURI);
  const [scale, setScale] = (0, import_react7.useState)(initialState.scale || "auto");
  const [currentPage, setCurrentPage] = (0, import_react7.useState)(
    initialState.page || 0
  );
  const [totalPage, setTotalPage] = (0, import_react7.useState)(0);
  return {
    pdfURI,
    setPdfURI,
    scale,
    setScale,
    currentPage,
    setCurrentPage,
    totalPage,
    setTotalPage
  };
}
var PDFViewerContext = import_react7.default.createContext(null);
function usePDFViewer() {
  const state = import_react7.default.useContext(PDFViewerContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}
var PDFViewerProvider = (props) => {
  const value = usePDFViewerHook(props.initialState);
  const internalState = useInternalStateHook();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PDFViewerContext.Provider, {
    value,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InternalStateContext.Provider, {
      value: internalState,
      children: props.children
    })
  });
};

// packages/utils/index.ts
function watchScroll(viewAreaElement, callback) {
  const debounceScroll = function(evt) {
    if (rAF) {
      return;
    }
    rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
      rAF = null;
      const currentX = viewAreaElement.scrollLeft;
      const lastX = state.lastX;
      if (currentX !== lastX) {
        state.right = currentX > lastX;
      }
      state.lastX = currentX;
      const currentY = viewAreaElement.scrollTop;
      const lastY = state.lastY;
      if (currentY !== lastY) {
        state.down = currentY > lastY;
      }
      state.lastY = currentY;
      callback(state);
    });
  };
  const state = {
    right: true,
    down: true,
    lastX: viewAreaElement.scrollLeft,
    lastY: viewAreaElement.scrollTop,
    _eventHandler: debounceScroll,
    remove: () => {
      viewAreaElement.removeEventListener("scroll", debounceScroll, true);
    }
  };
  let rAF = null;
  viewAreaElement.addEventListener("scroll", debounceScroll, true);
  return state;
}

// packages/viewer/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var import_react = require("react");
var PDFViewer = ({
  loadingComponent,
  errorComponent,
  width,
  height,
  scrollMode = "vertical"
}) => {
  const { pdfURI, scale, totalPage, setCurrentPage, setTotalPage } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const [loadingProgress, setLoadingProgress] = (0, import_react8.useState)(-1);
  const [pdfDoc, setPDFDoc] = (0, import_react8.useState)();
  const [errorReason, setErrorReason] = (0, import_react8.useState)();
  const loadingTask = (0, import_react8.useRef)(null);
  const viewerRef = (0, import_react8.useRef)(null);
  const [renderingPageIndex, setRenderingPageIndex] = (0, import_react8.useState)(1);
  const [renderMap, setRenderMap] = (0, import_react8.useState)({});
  const pageSize = usePageResizes({
    resizesRef: viewerRef,
    doc: pdfDoc,
    scale
  });
  (0, import_react8.useEffect)(() => {
    scaleNumberRef.current = pageSize.scale;
    console.log("pageSize", pageSize);
  }, [pageSize, scaleNumberRef]);
  (0, import_react8.useEffect)(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);
  (0, import_react8.useEffect)(() => {
    if (pdfURI) {
      setErrorReason(void 0);
      loadingTask.current = PDFLib.getDocument(pdfURI);
      loadingTask.current.onProgress = (progress) => {
        console.log("onProgress", progress);
        setLoadingProgress(progress);
      };
      loadingTask.current.promise.then((pdf) => {
        console.log("promise", pdf);
        setPDFDoc(pdf);
        setTotalPage(pdf.numPages);
      }).catch((reason) => {
        setErrorReason(reason);
      }).finally(() => {
        setCurrentPage(1);
        setLoading(false);
      });
    }
    return () => {
      loadingTask.current && loadingTask.current.destroy();
    };
  }, [pdfURI]);
  const scrollHandler = (0, import_react8.useCallback)(
    (state) => {
      if (scrollMode == "vertical") {
        if (pageSize.height == 0) {
          return;
        }
        const r2 = state.lastY % pageSize.height;
        const d2 = Math.floor(state.lastY / pageSize.height) + 1;
        const pageIndex = r2 > pageSize.height / 2 ? Math.min(d2 + 1, totalPage) : d2;
        setCurrentPage((pre) => {
          if (pre == pageIndex) {
            return pre;
          }
          return pageIndex;
        });
        return;
      }
      if (pageSize.width == 0) {
        return;
      }
      const r = state.lastX % pageSize.width;
      const d = Math.floor(state.lastX / pageSize.width) + 1;
      const page = r > pageSize.height / 2 ? Math.min(d + 1, totalPage) : d;
      setCurrentPage((pre) => {
        if (pre == page) {
          return pre;
        }
        return page;
      });
    },
    [pageSize.height, pageSize.width, scrollMode, setCurrentPage, totalPage]
  );
  (0, import_react8.useEffect)(() => {
    let scrollState = null;
    if (viewerRef.current) {
      scrollState = watchScroll(viewerRef.current, scrollHandler);
    }
    return () => {
      scrollState && scrollState.remove();
    };
  }, [scrollHandler]);
  function contentComponent() {
    if (!pdfURI) {
      return "\u8BF7\u8F93\u5165 PDF";
    }
    if (loading) {
      return typeof loadingComponent == "function" ? loadingComponent(loadingProgress) : loadingComponent;
    }
    if (!pdfDoc) {
      if (errorReason) {
        return typeof errorComponent == "function" ? errorComponent(errorReason) : errorComponent != null ? errorComponent : errorReason.toString();
      }
      return "Loading error";
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      children: pageSize.width == 0 ? null : (0, import_lodash.range)(0, pdfDoc.numPages).map((index) => {
        const pageIndex = index + 1;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(page_layer_default, __spreadProps(__spreadValues({
          pageIndex,
          doc: pdfDoc
        }, pageSize), {
          scrollMode,
          children: (doc) => renderingPageIndex < pageIndex && !renderMap[pageIndex] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(loading_layer_default, {}) : [
            /* @__PURE__ */ (0, import_react.createElement)(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
              pageDoc: doc,
              pageIndex,
              renderingIndex: renderingPageIndex,
              key: `canvas_layer_${pageIndex}`,
              onCompleted: () => {
                setRenderingPageIndex((pre) => pre + 1);
                setRenderMap((pre) => {
                  if (pre[pageIndex]) {
                    return pre;
                  }
                  return __spreadProps(__spreadValues({}, pre), {
                    pageIndex: true
                  });
                });
              }
            })),
            /* @__PURE__ */ (0, import_react.createElement)(text_layer_default, __spreadProps(__spreadValues({}, pageSize), {
              pageDoc: doc,
              pageIndex,
              key: `text_layer_${pageIndex}`
            })),
            renderingPageIndex <= pageIndex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(loading_layer_default, {}, `loading_layer_${pageIndex}`) : null
          ]
        }), index);
      })
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    id: "pdf_viewer_container",
    className: "viewer",
    style: { height, width },
    ref: viewerRef,
    children: contentComponent()
  });
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children
  });
};
var worker_default = PDFWorker;

// packages/toolbar/index.tsx
var import_react12 = require("react");

// packages/toolbar/scale-selector/index.tsx
var import_react10 = __toESM(require("@tippyjs/react"), 1);
var import_react11 = require("react");

// packages/assets/svg/arrow-drop-down.tsx
var import_react9 = __toESM(require("react"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
function SvgArrowDropDown(props, svgRef) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", __spreadProps(__spreadValues({
    viewBox: "0 0 24 24"
  }, props), {
    ref: svgRef,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
      d: "M7 10l5 5 5-5z"
    })
  }));
}
var ForwardRef = import_react9.default.forwardRef(SvgArrowDropDown);
var arrow_drop_down_default = ForwardRef;

// packages/toolbar/scale-selector/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ScaleSelector = () => {
  const options = (0, import_react11.useMemo)(() => {
    return [
      {
        value: "auto",
        label: "\u81EA\u52A8\u7F29\u653E"
      },
      {
        value: "fitWidth",
        label: "\u9002\u5408\u9875\u5BBD"
      },
      {
        value: "fitHeight",
        label: "\u9002\u5408\u9875\u9762"
      },
      {
        value: 0.5,
        label: "50%"
      },
      {
        value: 0.75,
        label: "75%"
      },
      {
        value: 1,
        label: "100%"
      },
      {
        value: 1.25,
        label: "125%"
      },
      {
        value: 1.5,
        label: "150%"
      },
      {
        value: 2,
        label: "200%"
      },
      {
        value: 3,
        label: "300%"
      },
      {
        value: 4,
        label: "400%"
      }
    ];
  }, []);
  const { scale, setScale } = usePDFViewer();
  const instanceRef = (0, import_react11.useRef)();
  const rootRef = (0, import_react11.useRef)(null);
  const displayName = (0, import_react11.useMemo)(() => {
    const findOption = options.find((v) => v.value == scale);
    if (findOption) {
      return findOption.label;
    }
    if (typeof scale == "number") {
      return `${(scale * 100).toFixed(0)}%`;
    }
    return "";
  }, [options, scale]);
  function onChanged(v) {
    setScale((pre) => {
      if (pre == v.value) {
        return pre;
      }
      return v.value;
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react10.default, {
    interactive: true,
    trigger: "click",
    onCreate: (instance) => instanceRef.current = instance,
    placement: "bottom-start",
    content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      className: "scale-wrapper",
      children: options.map((v) => {
        let valid = true;
        if (typeof v.value == "number") {
          if (v.value > MAX_SCALE) {
            valid = false;
            console.warn(`MAX_SCALE is ${MAX_SCALE}, you have ${v.value}`);
          } else if (v.value < MIN_SCALE) {
            valid = false;
            console.warn(`MIN_SCALE is ${MIN_SCALE}, you have ${v.value}`);
          }
        }
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          onClick: valid ? () => {
            var _a;
            onChanged(v);
            (_a = instanceRef.current) == null ? void 0 : _a.hide();
          } : void 0,
          className: "scale-option",
          children: v.label
        }, v.value);
      })
    }),
    popperOptions: {
      modifiers: [
        {
          enabled: true,
          name: "updatePosition",
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: ({ instance, state }) => {
            if (rootRef.current) {
              const headerWidthStr = `${rootRef.current.clientWidth}px`;
              if (state.styles.popper.width != headerWidthStr) {
                state.styles.popper.width = headerWidthStr;
                instance.update();
              }
            }
          }
        }
      ]
    },
    hideOnClick: true,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "scale-reference",
      ref: rootRef,
      children: [
        displayName,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(arrow_drop_down_default, {
          className: "select-icon"
        })
      ]
    })
  });
};
var scale_selector_default = ScaleSelector;

// packages/toolbar/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Toolbar = () => {
  const { setPdfURI, currentPage, setCurrentPage, setScale, totalPage } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [inputPageIndex, setInputPageIndex] = (0, import_react12.useState)(currentPage);
  const fileInputRef = (0, import_react12.useRef)(null);
  (0, import_react12.useEffect)(() => {
    setInputPageIndex(currentPage);
  }, [currentPage]);
  function onPreviousButtonClick() {
    setCurrentPage((pre) => {
      const res = pre > 1 ? pre - 1 : 1;
      scrollToPageIndex(res);
      return res;
    });
  }
  function onNextButtonClick() {
    setCurrentPage((pre) => {
      const res = pre < totalPage ? pre + 1 : totalPage;
      scrollToPageIndex(res);
      return res;
    });
  }
  function onPageInputChange(ev) {
    const v = ev.target.value;
    setInputPageIndex(parseInt(v));
  }
  function scrollToPageIndex(index) {
    console.log("scrollToPageIndex", index);
    const scrollEl = document.getElementById("pdf_viewer_container");
    if (scrollEl) {
      const el = document.getElementById(`__page_${index}__`);
      el && scrollEl.scrollTo({
        top: el.offsetTop
      });
    }
  }
  function onPageInputKeyDown(ev) {
    if (ev.key == "Enter") {
      if (inputPageIndex < 1 || inputPageIndex > totalPage) {
        setInputPageIndex(currentPage);
        return;
      }
      setCurrentPage(inputPageIndex);
      scrollToPageIndex(inputPageIndex);
    }
  }
  function fixed(s, d) {
    return parseFloat(s.toFixed(d));
  }
  function onZoomOut() {
    setScale(() => {
      const s = fixed(scaleNumberRef.current, 1);
      const delta = Math.max(1, Math.floor(s));
      return Math.max(MIN_SCALE, fixed(s - delta * 0.1, 2));
    });
  }
  function onZoomIn() {
    setScale(() => {
      const s = fixed(scaleNumberRef.current, 1);
      const delta = Math.max(1, Math.floor(s));
      return Math.min(MAX_SCALE, fixed(s + delta * 0.1, 2));
    });
  }
  function onFileInputButtonClicked() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  function onFileInputChanged(evt) {
    var _a;
    const file = (_a = evt.currentTarget.files) == null ? void 0 : _a[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log("onFileInputChanged", url);
      setPdfURI(url);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "toolbar",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "toolbar-left",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before search",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u67E5\u627E"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before previous",
            onClick: onPreviousButtonClick,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u4E0A\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before next",
            onClick: onNextButtonClick,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u4E0B\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "page-input-wrapper",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                className: "page-input",
                value: `${inputPageIndex}`,
                onChange: onPageInputChange,
                onKeyDown: onPageInputKeyDown,
                type: "number",
                title: "\u9875\u9762",
                size: 4,
                min: 1,
                autoComplete: "off",
                max: totalPage
              }),
              " ",
              "/ ",
              totalPage
            ]
          })
        ]
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "toolbar-center",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "zoom-button-wrapper",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                className: "common-button has-before zoom-button zoom-out",
                onClick: onZoomOut,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                  className: "button-label zoom-label",
                  children: "\u7F29\u5C0F"
                })
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "divider"
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                className: "common-button has-before zoom-button zoom-in",
                onClick: onZoomIn,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                  className: "button-label zoom-label",
                  children: "\u653E\u5927"
                })
              })
            ]
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(scale_selector_default, {})
        ]
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "toolbar-right",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before open",
            onClick: onFileInputButtonClicked,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u6253\u5F00"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before print",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u6253\u5370"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before  download",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u4FDD\u5B58"
            })
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            className: "common-button has-before draw",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "button-label",
              children: "\u7ED8\u56FE"
            })
          })
        ]
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
        type: "file",
        accept: ".pdf",
        id: "fileInput",
        className: "hidden",
        onChange: onFileInputChanged,
        ref: fileInputRef
      })
    ]
  });
};
var toolbar_default = Toolbar;
//# sourceMappingURL=index.cjs.map
