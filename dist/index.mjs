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
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx("div", {
    className: "canvas-layer",
    style: { width, height },
    ref: wrapperRef
  });
};
var canvas_layer_default = CanvasLayer;

// packages/layers/svg-layer.tsx
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
var SvgLayer = (props) => {
  return /* @__PURE__ */ jsx2(Fragment, {
    children: "SvgLayer Component"
  });
};
var svg_layer_default = SvgLayer;

// packages/layers/text-layer.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";

// packages/vendors/lib.ts
import * as PDFLib from "pdfjs-dist";

// packages/layers/text-layer.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx3("div", {
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
import {
  useCallback,
  useEffect as useEffect6,
  useRef as useRef5,
  useState as useState6
} from "react";

// packages/hooks/usePageResize.ts
import { useEffect as useEffect4, useState as useState3 } from "react";

// packages/types/constant.ts
var MIN_SCALE = 0.1;
var MAX_SCALE = 10;
var VERTICAL_PADDING = 16;
var HORIZONTAL_PADDING = 24;

// packages/hooks/useRectObserver.ts
import { useEffect as useEffect3, useRef as useRef3, useState as useState2 } from "react";
function useRectObserver({ elRef }) {
  const [width, setWidth] = useState2(0);
  const [height, setHeight] = useState2(0);
  const observer = useRef3(null);
  function resizeObserver(entries) {
    for (const entry of entries) {
      const { width: width2, height: height2 } = entry.contentRect;
      setWidth(width2);
      setHeight(height2);
    }
  }
  useEffect3(() => {
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
  const [pageSize, setPageSize] = useState3({
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizesRef
  });
  useEffect4(() => {
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
import { jsx as jsx4 } from "react/jsx-runtime";
var LoadingLayer = (props) => {
  return /* @__PURE__ */ jsx4("div", {
    className: "loading-layer"
  });
};
var loading_layer_default = LoadingLayer;

// packages/layers/page-layer.tsx
import {
  useEffect as useEffect5,
  useState as useState4
} from "react";
import { Fragment as Fragment2, jsx as jsx5 } from "react/jsx-runtime";
var PageLayer = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode
}) => {
  const [pageDoc, setPageDoc] = useState4();
  useEffect5(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ jsx5(Fragment2, {
    children: pageDoc ? /* @__PURE__ */ jsx5("div", {
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
import React5, { useState as useState5 } from "react";

// packages/provider/internal.ts
import React4, { useRef as useRef4 } from "react";
function useInternalStateHook() {
  const scaleNumberRef = useRef4(1);
  return {
    scaleNumberRef
  };
}
var InternalStateContext = React4.createContext(null);
function useInternalState() {
  const state = React4.useContext(InternalStateContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

// packages/provider/index.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function usePDFViewerHook(initialState = {
  scale: "auto",
  page: 0,
  pdfURI: ""
}) {
  const [pdfURI, setPdfURI] = useState5(initialState.pdfURI);
  const [scale, setScale] = useState5(initialState.scale || "auto");
  const [currentPage, setCurrentPage] = useState5(
    initialState.page || 0
  );
  const [totalPage, setTotalPage] = useState5(0);
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
var PDFViewerContext = React5.createContext(null);
function usePDFViewer() {
  const state = React5.useContext(PDFViewerContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}
var PDFViewerProvider = (props) => {
  const value = usePDFViewerHook(props.initialState);
  const internalState = useInternalStateHook();
  return /* @__PURE__ */ jsx6(PDFViewerContext.Provider, {
    value,
    children: /* @__PURE__ */ jsx6(InternalStateContext.Provider, {
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
import { jsx as jsx7 } from "react/jsx-runtime";
import { createElement } from "react";
var PDFViewer = ({
  loadingComponent,
  errorComponent,
  width,
  height,
  scrollMode = "vertical"
}) => {
  const { pdfURI, scale, totalPage, setCurrentPage, setTotalPage } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [loading, setLoading] = useState6(false);
  const [loadingProgress, setLoadingProgress] = useState6(-1);
  const [pdfDoc, setPDFDoc] = useState6();
  const [errorReason, setErrorReason] = useState6();
  const loadingTask = useRef5(null);
  const viewerRef = useRef5(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState6(1);
  const [renderMap, setRenderMap] = useState6({});
  const pageSize = usePageResizes({
    resizesRef: viewerRef,
    doc: pdfDoc,
    scale
  });
  useEffect6(() => {
    scaleNumberRef.current = pageSize.scale;
    console.log("pageSize", pageSize);
  }, [pageSize, scaleNumberRef]);
  useEffect6(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);
  useEffect6(() => {
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
  const scrollHandler = useCallback(
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
  useEffect6(() => {
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
    return /* @__PURE__ */ jsx7("div", {
      children: pageSize.width == 0 ? null : range(0, pdfDoc.numPages).map((index) => {
        const pageIndex = index + 1;
        return /* @__PURE__ */ jsx7(page_layer_default, __spreadProps(__spreadValues({
          pageIndex,
          doc: pdfDoc
        }, pageSize), {
          scrollMode,
          children: (doc) => renderingPageIndex < pageIndex && !renderMap[pageIndex] ? /* @__PURE__ */ jsx7(loading_layer_default, {}) : [
            /* @__PURE__ */ createElement(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
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
            /* @__PURE__ */ createElement(text_layer_default, __spreadProps(__spreadValues({}, pageSize), {
              pageDoc: doc,
              pageIndex,
              key: `text_layer_${pageIndex}`
            })),
            renderingPageIndex <= pageIndex ? /* @__PURE__ */ jsx7(loading_layer_default, {}, `loading_layer_${pageIndex}`) : null
          ]
        }), index);
      })
    });
  }
  return /* @__PURE__ */ jsx7("div", {
    id: "pdf_viewer_container",
    className: "viewer",
    style: { height, width },
    ref: viewerRef,
    children: contentComponent()
  });
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
import { Fragment as Fragment3, jsx as jsx8 } from "react/jsx-runtime";
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ jsx8(Fragment3, {
    children
  });
};
var worker_default = PDFWorker;

// packages/toolbar/index.tsx
import {
  useEffect as useEffect7,
  useRef as useRef7,
  useState as useState7
} from "react";

// packages/toolbar/scale-selector/index.tsx
import Tippy from "@tippyjs/react";
import { useMemo, useRef as useRef6 } from "react";

// packages/assets/svg/arrow-drop-down.tsx
import React7 from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function SvgArrowDropDown(props, svgRef) {
  return /* @__PURE__ */ jsx9("svg", __spreadProps(__spreadValues({
    viewBox: "0 0 24 24"
  }, props), {
    ref: svgRef,
    children: /* @__PURE__ */ jsx9("path", {
      d: "M7 10l5 5 5-5z"
    })
  }));
}
var ForwardRef = React7.forwardRef(SvgArrowDropDown);
var arrow_drop_down_default = ForwardRef;

// packages/toolbar/scale-selector/index.tsx
import { jsx as jsx10, jsxs } from "react/jsx-runtime";
var ScaleSelector = () => {
  const options = useMemo(() => {
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
  const instanceRef = useRef6();
  const rootRef = useRef6(null);
  const displayName = useMemo(() => {
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
  return /* @__PURE__ */ jsx10(Tippy, {
    interactive: true,
    trigger: "click",
    onCreate: (instance) => instanceRef.current = instance,
    placement: "bottom-start",
    content: /* @__PURE__ */ jsx10("div", {
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
        return /* @__PURE__ */ jsx10("div", {
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
    children: /* @__PURE__ */ jsxs("div", {
      className: "scale-reference",
      ref: rootRef,
      children: [
        displayName,
        /* @__PURE__ */ jsx10(arrow_drop_down_default, {
          className: "select-icon"
        })
      ]
    })
  });
};
var scale_selector_default = ScaleSelector;

// packages/toolbar/index.tsx
import { jsx as jsx11, jsxs as jsxs2 } from "react/jsx-runtime";
var Toolbar = () => {
  const { setPdfURI, currentPage, setCurrentPage, setScale, totalPage } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [inputPageIndex, setInputPageIndex] = useState7(currentPage);
  const fileInputRef = useRef7(null);
  useEffect7(() => {
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
  return /* @__PURE__ */ jsxs2("div", {
    className: "toolbar",
    children: [
      /* @__PURE__ */ jsxs2("div", {
        className: "toolbar-left",
        children: [
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before search",
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u67E5\u627E"
            })
          }),
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before previous",
            onClick: onPreviousButtonClick,
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u4E0A\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before next",
            onClick: onNextButtonClick,
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u4E0B\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ jsxs2("div", {
            className: "page-input-wrapper",
            children: [
              /* @__PURE__ */ jsx11("input", {
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
      /* @__PURE__ */ jsxs2("div", {
        className: "toolbar-center",
        children: [
          /* @__PURE__ */ jsxs2("div", {
            className: "zoom-button-wrapper",
            children: [
              /* @__PURE__ */ jsx11("button", {
                className: "common-button has-before zoom-button zoom-out",
                onClick: onZoomOut,
                children: /* @__PURE__ */ jsx11("span", {
                  className: "button-label zoom-label",
                  children: "\u7F29\u5C0F"
                })
              }),
              /* @__PURE__ */ jsx11("span", {
                className: "divider"
              }),
              /* @__PURE__ */ jsx11("button", {
                className: "common-button has-before zoom-button zoom-in",
                onClick: onZoomIn,
                children: /* @__PURE__ */ jsx11("span", {
                  className: "button-label zoom-label",
                  children: "\u653E\u5927"
                })
              })
            ]
          }),
          /* @__PURE__ */ jsx11(scale_selector_default, {})
        ]
      }),
      /* @__PURE__ */ jsxs2("div", {
        className: "toolbar-right",
        children: [
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before open",
            onClick: onFileInputButtonClicked,
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u6253\u5F00"
            })
          }),
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before print",
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u6253\u5370"
            })
          }),
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before  download",
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u4FDD\u5B58"
            })
          }),
          /* @__PURE__ */ jsx11("button", {
            className: "common-button has-before draw",
            children: /* @__PURE__ */ jsx11("span", {
              className: "button-label",
              children: "\u7ED8\u56FE"
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx11("input", {
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
export {
  canvas_layer_default as CanvasLayer,
  viewer_default as PDFViewer,
  PDFViewerProvider,
  worker_default as PDFWorker,
  svg_layer_default as SVGLayer,
  text_layer_default as TextLayer,
  toolbar_default as Toolbar,
  usePDFViewer
};
//# sourceMappingURL=index.mjs.map
