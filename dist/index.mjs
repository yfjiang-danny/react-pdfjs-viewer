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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

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
      try {
        pageDoc.getTextContent().then((textContent) => {
          if (textContent && textContainerRef.current) {
            renderTask.current = PDFLib.renderTextLayer({
              container: textContainerRef.current,
              viewport,
              textContent
            });
          }
        }).catch((err) => {
          var _a;
          (_a = renderTask.current) == null ? void 0 : _a.cancel();
        });
      } catch (error) {
      }
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

// packages/provider/index.tsx
import React4, { useState } from "react";

// packages/provider/internal.ts
import React3, { useRef as useRef3 } from "react";
function useInternalStateHook() {
  const scaleNumberRef = useRef3(1);
  return {
    scaleNumberRef
  };
}
var InternalStateContext = React3.createContext(null);
function useInternalState() {
  const state = React3.useContext(InternalStateContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

// packages/provider/index.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function usePDFViewerHook(initialState = {
  scale: "auto",
  page: 0,
  pdfURI: ""
}) {
  const [pdfURI, setPdfURI] = useState(initialState.pdfURI);
  const [pdfDoc, setPDFDoc] = useState();
  const [scale, setScale] = useState(initialState.scale || "auto");
  const [currentPage, setCurrentPage] = useState(
    initialState.page || 0
  );
  const [totalPage, setTotalPage] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  return {
    pdfURI,
    setPdfURI,
    pdfDoc,
    setPDFDoc,
    scale,
    setScale,
    currentPage,
    setCurrentPage,
    totalPage,
    setTotalPage,
    sidebarVisible,
    setSidebarVisible
  };
}
var PDFViewerContext = React4.createContext(null);
function usePDFViewer() {
  const state = React4.useContext(PDFViewerContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}
var PDFViewerProvider = (props) => {
  const value = usePDFViewerHook(props.initialState);
  const internalState = useInternalStateHook();
  return /* @__PURE__ */ jsx4(PDFViewerContext.Provider, {
    value,
    children: /* @__PURE__ */ jsx4(InternalStateContext.Provider, {
      value: internalState,
      children: props.children
    })
  });
};

// packages/thumbnail/index.tsx
import { range } from "lodash";
import { useEffect as useEffect4 } from "react";

// packages/utils/index.ts
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top > 0 && rect.top + rect.height / 2 < document.documentElement.clientHeight;
}
function scrollIntoViewByID(id) {
  const el = document.getElementById(id);
  if (el) {
    if (isInViewport(el)) {
      return;
    }
    scrollIntoView(el);
  }
}
function scrollIntoView(element, spot = { top: 0, left: 0 }, scrollMatches = false) {
  let parent = element.offsetParent;
  if (!parent) {
    console.error("offsetParent is not set -- cannot scroll");
    return;
  }
  let offsetY = element.offsetTop + element.clientTop;
  let offsetX = element.offsetLeft + element.clientLeft;
  while (parent.clientHeight === parent.scrollHeight && parent.clientWidth === parent.scrollWidth || scrollMatches && (parent.classList.contains("markedContent") || getComputedStyle(parent).overflow === "hidden")) {
    offsetY += parent.offsetTop;
    offsetX += parent.offsetLeft;
    parent = parent.offsetParent;
    if (!parent) {
      return;
    }
  }
  if (spot) {
    if (spot.top !== void 0) {
      offsetY += spot.top;
    }
    if (spot.left !== void 0) {
      offsetX += spot.left;
      parent.scrollLeft = offsetX;
    }
  }
  parent.scrollTop = offsetY;
}
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
function scrollToPageIndex(index) {
  const scrollEl = document.getElementById("__pdf_viewer_container__");
  if (scrollEl) {
    const el = document.getElementById(`__page_${index}__`);
    el && scrollEl.scrollTo({
      top: el.offsetTop
    });
  }
}

// packages/thumbnail/item.tsx
import { useEffect as useEffect3, useRef as useRef4, useState as useState2 } from "react";

// packages/types/constant.ts
var MIN_SCALE = 0.1;
var MAX_SCALE = 10;
var VERTICAL_PADDING = 16;
var HORIZONTAL_PADDING = 24;
var THUMBNAIL_WIDTH = 98;
var SIDEBAR_MIN = 200;
var SIDEBAR_MAX_PERCENT = 0.5;

// packages/thumbnail/util.ts
var _tempCanvas;
var TempImageFactory = class {
  static getCanvas(width, height) {
    const tempCanvas = __privateGet(this, _tempCanvas) || __privateSet(this, _tempCanvas, document.createElement("canvas"));
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.style.width = `${Math.floor(width)}px`;
    tempCanvas.style.height = `${Math.floor(height)}px`;
    const ctx = tempCanvas.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    return [tempCanvas, tempCanvas.getContext("2d")];
  }
  static destroyCanvas() {
    const tempCanvas = __privateGet(this, _tempCanvas);
    if (tempCanvas) {
      tempCanvas.width = 0;
      tempCanvas.height = 0;
    }
    __privateSet(this, _tempCanvas, null);
  }
};
_tempCanvas = new WeakMap();
__privateAdd(TempImageFactory, _tempCanvas, null);

// packages/thumbnail/item.tsx
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
var ThumbnailItem = ({ pdfDoc, pageIndex }) => {
  const { currentPage, setCurrentPage } = usePDFViewer();
  const [pageDoc, setPageDoc] = useState2();
  const rootRef = useRef4(null);
  const renderTask = useRef4(null);
  const [imgURI, setImgURI] = useState2();
  useEffect3(() => {
    pdfDoc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, pdfDoc]);
  useEffect3(() => {
    if (!pageDoc)
      return;
    const viewport = pageDoc.getViewport({ scale: 1 });
    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");
    const outputScale = window.devicePixelRatio || 1;
    canvasEl.height = Math.floor(viewport.height * outputScale);
    canvasEl.width = Math.floor(viewport.width * outputScale);
    canvasEl.style.width = `${Math.floor(viewport.width)}px`;
    canvasEl.style.height = `${Math.floor(viewport.height)}px`;
    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : void 0;
    const pageWidth = viewport.width, pageHeight = viewport.height, pageRatio = pageWidth / pageHeight;
    const thumbWidth = THUMBNAIL_WIDTH;
    const thumbHeight = THUMBNAIL_WIDTH / pageRatio;
    if (context) {
      renderTask.current = pageDoc.render({
        canvasContext: context,
        viewport,
        transform
      });
      renderTask.current.promise.then(
        () => {
          const [canvas, ctx] = TempImageFactory.getCanvas(
            thumbWidth,
            thumbHeight
          );
          if (ctx) {
            ctx.drawImage(
              canvasEl,
              0,
              0,
              viewport.width,
              viewport.height,
              0,
              0,
              thumbWidth,
              thumbHeight
            );
          }
          setImgURI(canvas.toDataURL());
        },
        () => {
        }
      );
    }
    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
        renderTask.current = null;
      }
    };
  }, [pageDoc]);
  const selectionClassName = "selection";
  useEffect3(() => {
    if (rootRef.current) {
      if (pageIndex == currentPage) {
        !rootRef.current.classList.contains(selectionClassName) && rootRef.current.classList.add(selectionClassName);
      } else {
        rootRef.current.classList.contains(selectionClassName) && rootRef.current.classList.remove(selectionClassName);
      }
    }
  }, [currentPage, pageIndex]);
  return /* @__PURE__ */ jsxs("div", {
    ref: rootRef,
    id: `thumbnail_page_${pageIndex}`,
    className: `thumbnail-item`,
    onClick: () => {
      setCurrentPage(pageIndex);
      scrollToPageIndex(pageIndex);
    },
    children: [
      imgURI ? /* @__PURE__ */ jsx5("img", {
        src: imgURI
      }) : null,
      /* @__PURE__ */ jsx5("div", {
        className: "thumbnail-item-page-mask",
        title: `\u7B2C${pageIndex}\u9875`,
        "data-num": pageIndex
      })
    ]
  });
};
var item_default = ThumbnailItem;

// packages/thumbnail/index.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
var Thumbnail = ({ pdfDoc, currentPage }) => {
  const { sidebarVisible } = usePDFViewer();
  useEffect4(() => {
    sidebarVisible && scrollIntoViewByID(`thumbnail_page_${currentPage}`);
  }, [currentPage, sidebarVisible]);
  return /* @__PURE__ */ jsx6("div", {
    id: "__thumbnail__",
    children: !pdfDoc ? null : range(0, pdfDoc.numPages).map((index) => {
      const pageIndex = index + 1;
      return /* @__PURE__ */ jsx6(item_default, {
        pdfDoc,
        pageIndex,
        currentPage
      }, pageIndex);
    })
  });
};
var thumbnail_default = Thumbnail;

// packages/toolbar/index.tsx
import { getPdfFilenameFromUrl } from "pdfjs-dist";
import {
  useEffect as useEffect5,
  useRef as useRef6,
  useState as useState3
} from "react";

// packages/utils/download.ts
function downloadBlob(blobUrl, filename) {
  const a = document.createElement("a");
  if (!a.click) {
    throw new Error('DownloadManager: "a.click()" is not supported.');
  }
  a.href = blobUrl;
  a.target = "_blank";
  if ("download" in a) {
    a.download = filename;
  }
  (document.body || document.documentElement).append(a);
  a.click();
  a.remove();
}

// packages/toolbar/scale-selector/index.tsx
import Tippy from "@tippyjs/react";
import { useMemo, useRef as useRef5 } from "react";

// packages/assets/svg/arrow-drop-down.tsx
import React7 from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
function SvgArrowDropDown(props, svgRef) {
  return /* @__PURE__ */ jsx7("svg", __spreadProps(__spreadValues({
    viewBox: "0 0 24 24"
  }, props), {
    ref: svgRef,
    children: /* @__PURE__ */ jsx7("path", {
      d: "M7 10l5 5 5-5z"
    })
  }));
}
var ForwardRef = React7.forwardRef(SvgArrowDropDown);
var arrow_drop_down_default = ForwardRef;

// packages/toolbar/scale-selector/index.tsx
import { jsx as jsx8, jsxs as jsxs2 } from "react/jsx-runtime";
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
  const instanceRef = useRef5();
  const rootRef = useRef5(null);
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
  return /* @__PURE__ */ jsx8(Tippy, {
    interactive: true,
    trigger: "click",
    onCreate: (instance) => instanceRef.current = instance,
    placement: "bottom-start",
    content: /* @__PURE__ */ jsx8("div", {
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
        return /* @__PURE__ */ jsx8("div", {
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
    children: /* @__PURE__ */ jsxs2("div", {
      className: "scale-reference",
      ref: rootRef,
      children: [
        displayName,
        /* @__PURE__ */ jsx8(arrow_drop_down_default, {
          className: "select-icon"
        })
      ]
    })
  });
};
var scale_selector_default = ScaleSelector;

// packages/toolbar/index.tsx
import { jsx as jsx9, jsxs as jsxs3 } from "react/jsx-runtime";
var Toolbar = (props) => {
  const {
    pdfDoc,
    pdfURI,
    setPdfURI,
    currentPage,
    setCurrentPage,
    setScale,
    totalPage,
    sidebarVisible,
    setSidebarVisible
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [inputPageIndex, setInputPageIndex] = useState3(currentPage);
  const fileInputRef = useRef6(null);
  useEffect5(() => {
    setInputPageIndex(currentPage);
  }, [currentPage]);
  function onSidebarButtonClick() {
    setSidebarVisible((pre) => !pre);
  }
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
      setPdfURI(url);
    }
  }
  function onPrintButtonClick() {
    window.print();
  }
  function downloadButtonClick() {
    if (!pdfDoc) {
      return;
    }
    pdfDoc.getData().then((data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      blobUrl && downloadBlob(blobUrl, getPdfFilenameFromUrl(pdfURI));
    }, (err) => {
      alert(err.toString());
    });
  }
  return /* @__PURE__ */ jsxs3("div", {
    className: "toolbar",
    children: [
      /* @__PURE__ */ jsxs3("div", {
        className: "toolbar-left",
        children: [
          /* @__PURE__ */ jsx9("button", {
            className: `common-button has-before sidebar ${sidebarVisible ? "active" : ""}`,
            onClick: onSidebarButtonClick,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u5207\u6362\u4FA7\u8FB9\u680F"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before search",
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u67E5\u627E"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before previous",
            onClick: onPreviousButtonClick,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u4E0A\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before next",
            onClick: onNextButtonClick,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u4E0B\u4E00\u9875"
            })
          }),
          /* @__PURE__ */ jsxs3("div", {
            className: "page-input-wrapper",
            children: [
              /* @__PURE__ */ jsx9("input", {
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
      /* @__PURE__ */ jsxs3("div", {
        className: "toolbar-center",
        children: [
          /* @__PURE__ */ jsxs3("div", {
            className: "zoom-button-wrapper",
            children: [
              /* @__PURE__ */ jsx9("button", {
                className: "common-button has-before zoom-button zoom-out",
                onClick: onZoomOut,
                children: /* @__PURE__ */ jsx9("span", {
                  className: "button-label zoom-label",
                  children: "\u7F29\u5C0F"
                })
              }),
              /* @__PURE__ */ jsx9("span", {
                className: "divider"
              }),
              /* @__PURE__ */ jsx9("button", {
                className: "common-button has-before zoom-button zoom-in",
                onClick: onZoomIn,
                children: /* @__PURE__ */ jsx9("span", {
                  className: "button-label zoom-label",
                  children: "\u653E\u5927"
                })
              })
            ]
          }),
          /* @__PURE__ */ jsx9(scale_selector_default, {})
        ]
      }),
      /* @__PURE__ */ jsxs3("div", {
        className: "toolbar-right",
        children: [
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before open",
            onClick: onFileInputButtonClicked,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u6253\u5F00"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before print",
            onClick: onPrintButtonClick,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u6253\u5370"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before  download",
            onClick: downloadButtonClick,
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u4FDD\u5B58"
            })
          }),
          /* @__PURE__ */ jsx9("button", {
            className: "common-button has-before draw",
            children: /* @__PURE__ */ jsx9("span", {
              className: "button-label",
              children: "\u7ED8\u56FE"
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx9("input", {
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

// packages/viewer/index.tsx
import { range as range3 } from "lodash";
import {
  useCallback,
  useEffect as useEffect11,
  useRef as useRef10,
  useState as useState8
} from "react";

// packages/hooks/usePageResize.ts
import { useEffect as useEffect7, useState as useState5 } from "react";

// packages/hooks/useRectObserver.ts
import { useEffect as useEffect6, useRef as useRef7, useState as useState4 } from "react";
function useRectObserver({ elRef }) {
  const [width, setWidth] = useState4(0);
  const [height, setHeight] = useState4(0);
  const observer = useRef7(null);
  function resizeObserver(entries) {
    for (const entry of entries) {
      const { width: width2, height: height2 } = entry.contentRect;
      setWidth(width2);
      setHeight(height2);
    }
  }
  useEffect6(() => {
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
  const [pageSize, setPageSize] = useState5({
    vWidth: 0,
    vHeight: 0,
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizesRef
  });
  useEffect7(() => {
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
        vWidth: viewport.width,
        vHeight: viewport.height,
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
import { jsx as jsx10 } from "react/jsx-runtime";
var LoadingLayer = (props) => {
  return /* @__PURE__ */ jsx10("div", {
    className: "loading-layer"
  });
};
var loading_layer_default = LoadingLayer;

// packages/layers/page-layer.tsx
import {
  useEffect as useEffect8,
  useState as useState6
} from "react";
import { Fragment as Fragment2, jsx as jsx11 } from "react/jsx-runtime";
var PageLayer = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode
}) => {
  const [pageDoc, setPageDoc] = useState6();
  useEffect8(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ jsx11(Fragment2, {
    children: pageDoc ? /* @__PURE__ */ jsx11("div", {
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

// packages/print/index.tsx
import { range as range2 } from "lodash";
import React12 from "react";
import { createPortal } from "react-dom";

// packages/print/item.tsx
import { useEffect as useEffect9, useRef as useRef8, useState as useState7 } from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
var ThumbnailItem2 = ({
  pdfDoc,
  pageIndex,
  width,
  height
}) => {
  const [pageDoc, setPageDoc] = useState7();
  const rootRef = useRef8(null);
  const renderTask = useRef8(null);
  const [imgURI, setImgURI] = useState7();
  useEffect9(() => {
    pdfDoc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, pdfDoc]);
  useEffect9(() => {
    if (!pageDoc)
      return;
    const viewport = pageDoc.getViewport({ scale: 1 });
    const canvasEl = document.createElement("canvas");
    const context = canvasEl.getContext("2d");
    const printUnits = 150 / 72;
    canvasEl.height = Math.floor(height * printUnits);
    canvasEl.width = Math.floor(width * printUnits);
    const transform = printUnits !== 1 ? [printUnits, 0, 0, printUnits, 0, 0] : void 0;
    if (context) {
      context.save();
      context.fillStyle = "rgb(255, 255, 255)";
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);
      context.restore();
      renderTask.current = pageDoc.render({
        canvasContext: context,
        viewport,
        intent: "print",
        transform
      });
      renderTask.current.promise.then(
        () => {
          if ("toBlob" in canvasEl && "createObjectURL" in URL) {
            canvasEl.toBlob((blob) => {
              blob && setImgURI(URL.createObjectURL(blob));
            });
          } else {
            setImgURI(canvasEl.toDataURL());
          }
        },
        () => {
        }
      );
    }
    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
        renderTask.current = null;
      }
    };
  }, [pageDoc]);
  return /* @__PURE__ */ jsx12("div", {
    ref: rootRef,
    id: `print_page_${pageIndex}`,
    className: `print-item`,
    children: imgURI ? /* @__PURE__ */ jsx12("img", {
      src: imgURI
    }) : null
  });
};
var item_default2 = ThumbnailItem2;

// packages/print/index.tsx
import { Fragment as Fragment3, jsx as jsx13, jsxs as jsxs4 } from "react/jsx-runtime";
var Print = ({ pdfDoc, width, height }) => {
  const container = React12.useMemo(() => {
    const id = "__print_container__";
    let containerEl = document.getElementById(`${id}`);
    if (containerEl) {
      return containerEl;
    }
    containerEl = document.createElement("div");
    containerEl.id = id;
    document.body.appendChild(containerEl);
    return containerEl;
  }, []);
  return createPortal(
    /* @__PURE__ */ jsxs4(Fragment3, {
      children: [
        /* @__PURE__ */ jsx13("div", {
          id: "__print_view__",
          children: !pdfDoc ? null : range2(0, pdfDoc.numPages).map((index) => {
            const pageIndex = index + 1;
            return /* @__PURE__ */ jsx13(item_default2, {
              pdfDoc,
              pageIndex,
              width,
              height
            }, pageIndex);
          })
        }),
        /* @__PURE__ */ jsx13("style", {
          dangerouslySetInnerHTML: {
            __html: `@page { size: ${width}pt ${height}pt }`
          }
        })
      ]
    }),
    container
  );
};
var print_default = Print;

// packages/sidebar/index.tsx
import { useEffect as useEffect10, useMemo as useMemo2, useRef as useRef9 } from "react";

// packages/types/types.ts
var isBrowser = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function getTargetElement(target, defaultElement) {
  if (!isBrowser) {
    return void 0;
  }
  if (!target) {
    return defaultElement;
  }
  let targetElement;
  if (typeof target === "function") {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }
  return targetElement;
}

// packages/services/drag-service.ts
var DragService = class {
  constructor(ops) {
    this.dragSources = [];
    this.dragFinishedFunctions = [];
    this.currentDragParams = void 0;
    this.dragging = false;
    this.mouseStartEvent = null;
    this.getDocument = void 0;
    this.getDocument = ops.getDocument;
    if (true) {
      console.log("Create DragService");
    }
  }
  getContainer() {
    return typeof this.getDocument == "function" ? this.getDocument() : this.getDocument ? this.getDocument : document.body;
  }
  addDragSource(params) {
    const el = getTargetElement(params.element);
    if (el) {
      const mouseDownListener = this.onMouseDown.bind(this, params);
      el.addEventListener("mousedown", mouseDownListener);
      this.dragSources.push(__spreadProps(__spreadValues({}, params), {
        mouseDownListener
      }));
    }
  }
  removeDragSource(params) {
    const findIndex = this.dragSources.findIndex((d) => {
      return d.element === params.element;
    });
    if (findIndex != -1) {
      const dragSource = this.dragSources[findIndex];
      const el = getTargetElement(dragSource.element);
      if (el) {
        el.removeEventListener(
          "mousedown",
          dragSource.mouseDownListener
        );
        this.dragSources.splice(findIndex, 1);
      }
    }
  }
  hasDragSource(source) {
    return !!this.dragSources.find((v) => v.element === source.element);
  }
  destroy() {
    const dragSource = this.dragSources.pop();
    const el = getTargetElement(dragSource == null ? void 0 : dragSource.element);
    if (dragSource && el) {
      el.removeEventListener(
        "mousedown",
        dragSource.mouseDownListener
      );
    }
  }
  isDragging() {
    return this.dragging;
  }
  onMouseDown(params, event) {
    const _this = this;
    const ev = event;
    if (this.dragging) {
      return;
    }
    if (ev.button !== 0) {
      return;
    }
    this.currentDragParams = params;
    this.dragging = false;
    this.mouseStartEvent = ev;
    const doc = this.getContainer();
    const mouseMoveEvent = function(event2) {
      const el = getTargetElement(params.element);
      if (el) {
        return _this.onMouseMove(event2, el);
      }
    };
    const mouseUpEvent = function(event2) {
      const el = getTargetElement(params.element);
      if (el) {
        return _this.onMouseUp(event2, el);
      }
    };
    const target = doc;
    const events = [
      { target, type: "mousemove", listener: mouseMoveEvent },
      { target, type: "mouseup", listener: mouseUpEvent }
    ];
    this.addTemporaryEvents(events);
    doc.style.userSelect = "none";
  }
  onMouseMove(event, el) {
    this.dragging = true;
    this.onDragging(event, el);
  }
  onCancel() {
    var _a;
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.mouseStartEvent = null;
    while (this.dragFinishedFunctions.length > 0) {
      (_a = this.dragFinishedFunctions.pop()) == null ? void 0 : _a();
    }
    const doc = this.getContainer();
    doc.style.userSelect = "initial";
  }
  onMouseUp(event, el) {
    var _a;
    if (this.dragging) {
      this.onDraggingEnd(event, el);
      this.dragging = false;
    }
    this.mouseStartEvent = null;
    while (this.dragFinishedFunctions.length > 0) {
      (_a = this.dragFinishedFunctions.pop()) == null ? void 0 : _a();
    }
    const doc = this.getContainer();
    doc.style.userSelect = "initial";
  }
  onDragging(event, el) {
  }
  onDraggingEnd(event, el) {
  }
  addTemporaryEvents(events) {
    events.forEach(function(currentEvent) {
      const target = currentEvent.target, type = currentEvent.type, listener = currentEvent.listener, options = currentEvent.options;
      target.addEventListener(type, listener, options);
    });
    this.dragFinishedFunctions.push(function() {
      events.forEach(function(currentEvent) {
        const target = currentEvent.target, type = currentEvent.type, listener = currentEvent.listener, options = currentEvent.options;
        target.removeEventListener(type, listener, options);
      });
    });
  }
};

// packages/sidebar/resizer.ts
var SidebarResizer = class extends DragService {
  constructor(ops) {
    super(ops);
    this.sidebarWidth = 0;
  }
  onMouseDown(params, event) {
    super.onMouseDown(params, event);
    const sidebar = document.getElementById("__sidebar__");
    if (sidebar) {
      this.sidebarWidth = sidebar.offsetWidth;
    }
  }
  onDragging(event, el) {
    if (this.mouseStartEvent) {
      const offsetX = event.pageX - this.mouseStartEvent.pageX;
      const wd = Math.max(
        Math.min(
          this.sidebarWidth + offsetX,
          SIDEBAR_MAX_PERCENT * this.getContainer().clientWidth
        ),
        SIDEBAR_MIN
      );
      const htmlEl = document.getElementsByTagName("html")[0];
      htmlEl.style.setProperty("--sidebar-width", wd + "px");
    }
  }
};

// packages/sidebar/index.tsx
import { jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
var Sidebar = ({ children }) => {
  const { sidebarVisible } = usePDFViewer();
  const resizerRef = useRef9(null);
  const dragService = useMemo2(() => {
    return new SidebarResizer({});
  }, []);
  useEffect10(() => {
    console.log("dragService", dragService);
    dragService == null ? void 0 : dragService.addDragSource({
      element: resizerRef
    });
    return () => {
      dragService == null ? void 0 : dragService.removeDragSource({
        element: resizerRef
      });
    };
  }, [dragService, resizerRef]);
  return /* @__PURE__ */ jsxs5("div", {
    id: "__sidebar__",
    className: `${sidebarVisible ? "" : "hidden"}`,
    children: [
      /* @__PURE__ */ jsx14("div", {
        id: "__sidebar_content__",
        children
      }),
      /* @__PURE__ */ jsx14("div", {
        id: "__sidebar_resizer__",
        ref: resizerRef
      })
    ]
  });
};
var sidebar_default = Sidebar;

// packages/viewer/index.tsx
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
import { createElement } from "react";
var PDFViewer = ({
  loadingComponent,
  errorComponent,
  width,
  height,
  scrollMode = "vertical",
  thumbnail = true
}) => {
  const {
    pdfURI,
    scale,
    totalPage,
    currentPage,
    setCurrentPage,
    setTotalPage,
    sidebarVisible,
    pdfDoc,
    setPDFDoc
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [loading, setLoading] = useState8(false);
  const [loadingProgress, setLoadingProgress] = useState8(-1);
  const [errorReason, setErrorReason] = useState8();
  const loadingTask = useRef10(null);
  const viewerRef = useRef10(null);
  const scrollElRef = useRef10(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState8(1);
  const [renderMap, setRenderMap] = useState8({});
  const pageSize = usePageResizes({
    resizesRef: viewerRef,
    doc: pdfDoc,
    scale
  });
  useEffect11(() => {
    scaleNumberRef.current = pageSize.scale;
  }, [pageSize, scaleNumberRef]);
  useEffect11(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);
  useEffect11(() => {
    if (pdfURI) {
      setErrorReason(void 0);
      loadingTask.current = PDFLib.getDocument(pdfURI);
      loadingTask.current.onProgress = (progress) => {
        setLoadingProgress(progress);
      };
      loadingTask.current.promise.then((pdf) => {
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
  useEffect11(() => {
    let scrollState = null;
    if (scrollElRef.current) {
      scrollState = watchScroll(scrollElRef.current, scrollHandler);
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
      return "Waiting...";
    }
    return /* @__PURE__ */ jsxs6("div", {
      id: "__pdf_viewer_container__",
      className: "viewer",
      ref: scrollElRef,
      children: [
        pageSize.width == 0 ? null : range3(0, pdfDoc.numPages).map((index) => {
          const pageIndex = index + 1;
          return /* @__PURE__ */ jsx15(page_layer_default, __spreadProps(__spreadValues({
            pageIndex,
            doc: pdfDoc
          }, pageSize), {
            scrollMode,
            children: (doc) => renderingPageIndex < pageIndex && !renderMap[pageIndex] ? /* @__PURE__ */ jsx15(loading_layer_default, {}) : [
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
              renderingPageIndex <= pageIndex ? /* @__PURE__ */ jsx15(loading_layer_default, {}, `loading_layer_${pageIndex}`) : null
            ]
          }), index);
        }),
        pageSize.width != 0 && pageSize.height != 0 && /* @__PURE__ */ jsx15(print_default, {
          height: pageSize.vHeight,
          width: pageSize.vWidth,
          pdfDoc
        })
      ]
    });
  }
  return /* @__PURE__ */ jsxs6("div", {
    id: "__outer_container__",
    style: { height, width },
    ref: viewerRef,
    className: sidebarVisible ? "sidebar-visible" : "",
    children: [
      /* @__PURE__ */ jsx15(sidebar_default, {
        children: thumbnail && /* @__PURE__ */ jsx15(thumbnail_default, {
          currentPage,
          pdfDoc
        })
      }),
      contentComponent()
    ]
  });
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
import { Fragment as Fragment4, jsx as jsx16 } from "react/jsx-runtime";
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ jsx16(Fragment4, {
    children
  });
};
var worker_default = PDFWorker;
export {
  canvas_layer_default as CanvasLayer,
  viewer_default as PDFViewer,
  PDFViewerProvider,
  worker_default as PDFWorker,
  svg_layer_default as SVGLayer,
  text_layer_default as TextLayer,
  thumbnail_default as Thumbnail,
  toolbar_default as Toolbar,
  usePDFViewer
};
//# sourceMappingURL=index.mjs.map
