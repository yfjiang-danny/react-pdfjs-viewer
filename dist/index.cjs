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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// packages/index.ts
var packages_exports = {};
__export(packages_exports, {
  CanvasLayer: () => canvas_layer_default,
  PDFViewer: () => viewer_default,
  PDFViewerProvider: () => PDFViewerProvider,
  PDFWorker: () => worker_default,
  SVGLayer: () => svg_layer_default,
  TextLayer: () => text_layer_default,
  Thumbnail: () => thumbnail_default,
  Toolbar: () => toolbar_default,
  usePDFViewer: () => usePDFViewer
});
module.exports = __toCommonJS(packages_exports);

// packages/layers/canvas-layer.tsx
var import_react = __toESM(require("react"), 1);
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
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "canvas-layer",
    style: { width, height },
    ref: wrapperRef
  });
};
var canvas_layer_default = CanvasLayer;

// packages/layers/svg-layer.tsx
var import_react2 = __toESM(require("react"), 1);
var SvgLayer = (props) => {
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, "SvgLayer Component");
};
var svg_layer_default = SvgLayer;

// packages/layers/text-layer.tsx
var import_react3 = __toESM(require("react"), 1);

// packages/vendors/lib.ts
var PDFLib = __toESM(require("pdfjs-dist"), 1);

// packages/layers/text-layer.tsx
var TextLayer = (props) => {
  const { pageDoc, pageIndex, width, height, scale } = props;
  const textContainerRef = (0, import_react3.useRef)(null);
  const renderTask = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
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
  return /* @__PURE__ */ import_react3.default.createElement("div", {
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
var import_react5 = __toESM(require("react"), 1);

// packages/provider/internal.ts
var import_react4 = __toESM(require("react"), 1);
function useInternalStateHook() {
  const scaleNumberRef = (0, import_react4.useRef)(1);
  return {
    scaleNumberRef
  };
}
var InternalStateContext = import_react4.default.createContext(null);
function useInternalState() {
  const state = import_react4.default.useContext(InternalStateContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}

// packages/provider/index.tsx
function usePDFViewerHook(initialState = {
  scale: "auto",
  page: 0,
  pdfURI: ""
}) {
  const [pdfURI, setPdfURI] = (0, import_react5.useState)(initialState.pdfURI);
  const [pdfDoc, setPDFDoc] = (0, import_react5.useState)();
  const [scale, setScale] = (0, import_react5.useState)(initialState.scale || "auto");
  const [currentPage, setCurrentPage] = (0, import_react5.useState)(
    initialState.page || 0
  );
  const [totalPage, setTotalPage] = (0, import_react5.useState)(0);
  const [sidebarVisible, setSidebarVisible] = (0, import_react5.useState)(false);
  const [propertyModalVisible, setPropertyModalVisible] = (0, import_react5.useState)(false);
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
    setSidebarVisible,
    propertyModalVisible,
    setPropertyModalVisible
  };
}
var PDFViewerContext = import_react5.default.createContext(null);
function usePDFViewer() {
  const state = import_react5.default.useContext(PDFViewerContext);
  if (!state) {
    throw new Error("Component must be wrapped with <PDFViewerProvider>");
  }
  return state;
}
var PDFViewerProvider = (props) => {
  const value = usePDFViewerHook(props.initialState);
  const internalState = useInternalStateHook();
  return /* @__PURE__ */ import_react5.default.createElement(PDFViewerContext.Provider, {
    value
  }, /* @__PURE__ */ import_react5.default.createElement(InternalStateContext.Provider, {
    value: internalState
  }, props.children));
};

// packages/thumbnail/index.tsx
var import_lodash = require("lodash");
var import_react7 = __toESM(require("react"), 1);

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
var import_react6 = __toESM(require("react"), 1);

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
var ThumbnailItem = ({ pdfDoc, pageIndex }) => {
  const { currentPage, setCurrentPage } = usePDFViewer();
  const [pageDoc, setPageDoc] = (0, import_react6.useState)();
  const rootRef = (0, import_react6.useRef)(null);
  const renderTask = (0, import_react6.useRef)(null);
  const [imgURI, setImgURI] = (0, import_react6.useState)();
  (0, import_react6.useEffect)(() => {
    pdfDoc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, pdfDoc]);
  (0, import_react6.useEffect)(() => {
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
  (0, import_react6.useEffect)(() => {
    if (rootRef.current) {
      if (pageIndex == currentPage) {
        !rootRef.current.classList.contains(selectionClassName) && rootRef.current.classList.add(selectionClassName);
      } else {
        rootRef.current.classList.contains(selectionClassName) && rootRef.current.classList.remove(selectionClassName);
      }
    }
  }, [currentPage, pageIndex]);
  return /* @__PURE__ */ import_react6.default.createElement("div", {
    ref: rootRef,
    id: `thumbnail_page_${pageIndex}`,
    className: `thumbnail-item`,
    onClick: () => {
      setCurrentPage(pageIndex);
      scrollToPageIndex(pageIndex);
    }
  }, imgURI ? /* @__PURE__ */ import_react6.default.createElement("img", {
    src: imgURI
  }) : null, /* @__PURE__ */ import_react6.default.createElement("div", {
    className: "thumbnail-item-page-mask",
    title: `\u7B2C${pageIndex}\u9875`,
    "data-num": pageIndex
  }));
};
var item_default = ThumbnailItem;

// packages/thumbnail/index.tsx
var Thumbnail = ({ pdfDoc, currentPage }) => {
  const { sidebarVisible } = usePDFViewer();
  (0, import_react7.useEffect)(() => {
    sidebarVisible && scrollIntoViewByID(`thumbnail_page_${currentPage}`);
  }, [currentPage, sidebarVisible]);
  return /* @__PURE__ */ import_react7.default.createElement("div", {
    id: "__thumbnail__"
  }, !pdfDoc ? null : (0, import_lodash.range)(0, pdfDoc.numPages).map((index) => {
    const pageIndex = index + 1;
    return /* @__PURE__ */ import_react7.default.createElement(item_default, {
      key: pageIndex,
      pdfDoc,
      pageIndex,
      currentPage
    });
  }));
};
var thumbnail_default = Thumbnail;

// packages/toolbar/index.tsx
var import_pdfjs_dist = require("pdfjs-dist");
var import_react14 = __toESM(require("react"), 1);

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
var import_react9 = __toESM(require("@tippyjs/react"), 1);
var import_react10 = __toESM(require("react"), 1);

// packages/assets/svg/arrow-drop-down.tsx
var import_react8 = __toESM(require("react"), 1);
function SvgArrowDropDown(props, svgRef) {
  return /* @__PURE__ */ import_react8.default.createElement("svg", __spreadProps(__spreadValues({
    viewBox: "0 0 24 24"
  }, props), {
    ref: svgRef
  }), /* @__PURE__ */ import_react8.default.createElement("path", {
    d: "M7 10l5 5 5-5z"
  }));
}
var ForwardRef = import_react8.default.forwardRef(SvgArrowDropDown);
var arrow_drop_down_default = ForwardRef;

// packages/toolbar/scale-selector/index.tsx
var ScaleSelector = () => {
  const options = (0, import_react10.useMemo)(() => {
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
  const instanceRef = (0, import_react10.useRef)();
  const rootRef = (0, import_react10.useRef)(null);
  const displayName = (0, import_react10.useMemo)(() => {
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
  return /* @__PURE__ */ import_react10.default.createElement(import_react9.default, {
    interactive: true,
    trigger: "click",
    onCreate: (instance) => instanceRef.current = instance,
    placement: "bottom-start",
    content: /* @__PURE__ */ import_react10.default.createElement("div", {
      className: "scale-wrapper"
    }, options.map((v) => {
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
      return /* @__PURE__ */ import_react10.default.createElement("div", {
        key: v.value,
        onClick: valid ? () => {
          var _a;
          onChanged(v);
          (_a = instanceRef.current) == null ? void 0 : _a.hide();
        } : void 0,
        className: "scale-option"
      }, v.label);
    })),
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
    hideOnClick: true
  }, /* @__PURE__ */ import_react10.default.createElement("div", {
    className: "scale-reference",
    ref: rootRef
  }, displayName, /* @__PURE__ */ import_react10.default.createElement(arrow_drop_down_default, {
    className: "select-icon"
  })));
};
var scale_selector_default = ScaleSelector;

// packages/toolbar/tool/index.tsx
var import_react12 = __toESM(require("@tippyjs/react"), 1);
var import_react13 = __toESM(require("react"), 1);

// packages/share/button/index.tsx
var import_react11 = __toESM(require("react"), 1);
var Button = (_a) => {
  var _b = _a, { className } = _b, restProps = __objRest(_b, ["className"]);
  return /* @__PURE__ */ import_react11.default.createElement("button", __spreadProps(__spreadValues({}, restProps), {
    className: `share-button ${className != null ? className : ""}`
  }));
};
var button_default = Button;

// packages/toolbar/tool/index.tsx
var Tool = ({ className, children, onItemClick }) => {
  const instanceRef = (0, import_react13.useRef)(null);
  return /* @__PURE__ */ import_react13.default.createElement(import_react12.default, {
    onMount: (instance) => {
      instanceRef.current = instance;
    },
    content: /* @__PURE__ */ import_react13.default.createElement("div", {
      className: "tool-modal"
    }, /* @__PURE__ */ import_react13.default.createElement(button_default, {
      className: "tool-button",
      onClick: () => {
        instanceRef.current && instanceRef.current.hide();
        setTimeout(() => {
          onItemClick == null ? void 0 : onItemClick("property");
        }, 0);
      }
    }, /* @__PURE__ */ import_react13.default.createElement("span", null, "\u6587\u6863\u5C5E\u6027"))),
    interactive: true,
    trigger: "click",
    className: "tool-tippy"
  }, children);
};
var tool_default = Tool;

// packages/toolbar/index.tsx
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
    setSidebarVisible,
    setPropertyModalVisible
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [inputPageIndex, setInputPageIndex] = (0, import_react14.useState)(currentPage);
  const fileInputRef = (0, import_react14.useRef)(null);
  (0, import_react14.useEffect)(() => {
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
    pdfDoc.getData().then(
      (data) => {
        const blob = new Blob([data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        blobUrl && downloadBlob(blobUrl, (0, import_pdfjs_dist.getPdfFilenameFromUrl)(pdfURI));
      },
      (err) => {
        alert(err.toString());
      }
    );
  }
  function onToolClick(type) {
    switch (type) {
      case "property":
        setPropertyModalVisible(true);
        break;
      default:
        break;
    }
  }
  return /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "toolbar"
  }, /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "toolbar-left"
  }, /* @__PURE__ */ import_react14.default.createElement("button", {
    className: `common-button has-before sidebar ${sidebarVisible ? "active" : ""}`,
    onClick: onSidebarButtonClick
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u5207\u6362\u4FA7\u8FB9\u680F")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before search"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u67E5\u627E")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before previous",
    onClick: onPreviousButtonClick
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u4E0A\u4E00\u9875")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before next",
    onClick: onNextButtonClick
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u4E0B\u4E00\u9875")), /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "page-input-wrapper"
  }, /* @__PURE__ */ import_react14.default.createElement("input", {
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
  }), " ", "/ ", totalPage)), /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "toolbar-center"
  }, /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "zoom-button-wrapper"
  }, /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before zoom-button zoom-out",
    onClick: onZoomOut
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label zoom-label"
  }, "\u7F29\u5C0F")), /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "divider"
  }), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before zoom-button zoom-in",
    onClick: onZoomIn
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label zoom-label"
  }, "\u653E\u5927"))), /* @__PURE__ */ import_react14.default.createElement(scale_selector_default, null)), /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "toolbar-right"
  }, /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before open",
    onClick: onFileInputButtonClicked,
    title: "\u6253\u5F00"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u6253\u5F00")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before print",
    onClick: onPrintButtonClick,
    title: "\u6253\u5370"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u6253\u5370")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before  download",
    onClick: downloadButtonClick,
    title: "\u4FDD\u5B58"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u4FDD\u5B58")), /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before draw",
    title: "\u7ED8\u56FE"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u7ED8\u56FE")), /* @__PURE__ */ import_react14.default.createElement(tool_default, {
    onItemClick: onToolClick
  }, /* @__PURE__ */ import_react14.default.createElement("button", {
    className: "common-button has-before tools",
    title: "\u5DE5\u5177"
  }, /* @__PURE__ */ import_react14.default.createElement("span", {
    className: "button-label"
  }, "\u5DE5\u5177")))), /* @__PURE__ */ import_react14.default.createElement("input", {
    type: "file",
    accept: ".pdf",
    id: "fileInput",
    className: "hidden",
    onChange: onFileInputChanged,
    ref: fileInputRef
  }));
};
var toolbar_default = Toolbar;

// packages/viewer/index.tsx
var import_lodash3 = require("lodash");
var import_react24 = __toESM(require("react"), 1);

// packages/hooks/usePageResize.ts
var import_react16 = require("react");

// packages/hooks/useRectObserver.ts
var import_react15 = require("react");
function useRectObserver({ elRef }) {
  const [width, setWidth] = (0, import_react15.useState)(0);
  const [height, setHeight] = (0, import_react15.useState)(0);
  const observer = (0, import_react15.useRef)(null);
  function resizeObserver(entries) {
    for (const entry of entries) {
      const { width: width2, height: height2 } = entry.contentRect;
      setWidth(width2);
      setHeight(height2);
    }
  }
  (0, import_react15.useEffect)(() => {
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
  const [pageSize, setPageSize] = (0, import_react16.useState)({
    vWidth: 0,
    vHeight: 0,
    width: 0,
    height: 0,
    scale: 1
  });
  const { width, height } = useRectObserver({
    elRef: resizesRef
  });
  (0, import_react16.useEffect)(() => {
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
var import_react17 = __toESM(require("react"), 1);
var LoadingLayer = (props) => {
  return /* @__PURE__ */ import_react17.default.createElement("div", {
    className: "loading-layer"
  });
};
var loading_layer_default = LoadingLayer;

// packages/layers/page-layer.tsx
var import_react18 = __toESM(require("react"), 1);
var PageLayer = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode
}) => {
  const [pageDoc, setPageDoc] = (0, import_react18.useState)();
  (0, import_react18.useEffect)(() => {
    doc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, doc]);
  return /* @__PURE__ */ import_react18.default.createElement(import_react18.default.Fragment, null, pageDoc ? /* @__PURE__ */ import_react18.default.createElement("div", {
    className: `page-layer ${scrollMode}-scroll`,
    id: `__page_${pageIndex}__`,
    style: {
      height,
      width
    }
  }, children(pageDoc)) : null);
};
var page_layer_default = PageLayer;

// packages/print/index.tsx
var import_lodash2 = require("lodash");
var import_react20 = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");

// packages/print/item.tsx
var import_react19 = __toESM(require("react"), 1);
var ThumbnailItem2 = ({
  pdfDoc,
  pageIndex,
  width,
  height
}) => {
  const [pageDoc, setPageDoc] = (0, import_react19.useState)();
  const rootRef = (0, import_react19.useRef)(null);
  const renderTask = (0, import_react19.useRef)(null);
  const [imgURI, setImgURI] = (0, import_react19.useState)();
  (0, import_react19.useEffect)(() => {
    pdfDoc.getPage(pageIndex).then((pageDoc2) => {
      setPageDoc(pageDoc2);
    });
  }, [pageIndex, pdfDoc]);
  (0, import_react19.useEffect)(() => {
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
  return /* @__PURE__ */ import_react19.default.createElement("div", {
    ref: rootRef,
    id: `print_page_${pageIndex}`,
    className: `print-item`
  }, imgURI ? /* @__PURE__ */ import_react19.default.createElement("img", {
    src: imgURI
  }) : null);
};
var item_default2 = ThumbnailItem2;

// packages/print/index.tsx
var Print = ({ pdfDoc, width, height }) => {
  const container = import_react20.default.useMemo(() => {
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
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement("div", {
      id: "__print_view__"
    }, !pdfDoc ? null : (0, import_lodash2.range)(0, pdfDoc.numPages).map((index) => {
      const pageIndex = index + 1;
      return /* @__PURE__ */ import_react20.default.createElement(item_default2, {
        key: pageIndex,
        pdfDoc,
        pageIndex,
        width,
        height
      });
    })), /* @__PURE__ */ import_react20.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `@page { size: ${width}pt ${height}pt }`
      }
    })),
    container
  );
};
var print_default = Print;

// packages/property/index.tsx
var import_react22 = __toESM(require("react"), 1);

// packages/utils/properties.ts
var import_pdfjs_dist2 = require("pdfjs-dist");
function parseFileSize(fileSize = 0) {
  const kb = fileSize / 1024, mb = kb / 1024;
  if (!kb) {
    return void 0;
  }
  return mb > 1 ? `${+mb.toPrecision(3)}mb` : `${mb < 1 && +kb.toPrecision(3)}kb`;
}
function parseDate(inputDate) {
  const dateObject = import_pdfjs_dist2.PDFDateString.toDateObject(inputDate);
  if (!dateObject) {
    return void 0;
  }
  return dateObject.toLocaleDateString();
}
function getPageSizeInches({ view, userUnit, rotate }) {
  const [x1, y1, x2, y2] = view;
  const changeOrientation = rotate % 180 !== 0;
  const width = (x2 - x1) / 72 * userUnit;
  const height = (y2 - y1) / 72 * userUnit;
  return {
    width: changeOrientation ? height : width,
    height: changeOrientation ? width : height
  };
}

// packages/property/index.tsx
var import_pdfjs_dist3 = require("pdfjs-dist");

// packages/share/modal/index.tsx
var import_react21 = __toESM(require("react"), 1);
var Modal = ({
  visible,
  wrapperClassName,
  className,
  mask = true,
  children
}) => {
  return /* @__PURE__ */ import_react21.default.createElement("div", {
    className: `share-modal-container ${wrapperClassName != null ? wrapperClassName : ""}`,
    style: { display: visible ? "flex" : "none" }
  }, mask && /* @__PURE__ */ import_react21.default.createElement("div", {
    className: "share-modal-mask"
  }), /* @__PURE__ */ import_react21.default.createElement("div", {
    className: `share-modal ${className != null ? className : ""}`
  }, children));
};
var modal_default = Modal;

// packages/property/index.tsx
var PropertyModal = ({ visible, onClose }) => {
  const { pdfURI, pdfDoc, currentPage } = usePDFViewer();
  const [properties, setProperties] = (0, import_react22.useState)();
  (0, import_react22.useLayoutEffect)(() => {
    if (pdfDoc) {
      Promise.all([pdfDoc.getMetadata(), pdfDoc.getPage(currentPage)]).then(
        ([pdfInfo, pageDoc]) => {
          const infoObj = pdfInfo.info;
          const fileName = pdfInfo["contentDispositionFilename"] || (0, import_pdfjs_dist3.getFilenameFromUrl)(pdfURI);
          const pageSize = getPageSizeInches(pageDoc);
          setProperties({
            pageSize: `${pageSize.width * 2.54}cm*${pageSize.height * 2.54}cm`,
            fileSize: parseFileSize(
              pdfInfo["contentLength"]
            ),
            creationDate: parseDate(infoObj["CreationDate"]),
            modificationDate: parseDate(infoObj.ModDate),
            fileName,
            title: infoObj.Title,
            author: infoObj.Author,
            subject: infoObj.Subject,
            keywords: infoObj.Keywords,
            creator: infoObj.Creator,
            producer: infoObj.Producer,
            version: infoObj.PDFFormatVersion,
            pageCount: pdfDoc.numPages
          });
        },
        (err) => {
        }
      ).catch((reason) => {
      });
    }
  }, [currentPage, pdfDoc, pdfURI]);
  (0, import_react22.useEffect)(() => {
    console.log("property", properties);
  }, [properties]);
  return /* @__PURE__ */ import_react22.default.createElement(modal_default, {
    className: "property-modal",
    visible
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "session"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u6587\u4EF6\u540D\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.fileName)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u6587\u4EF6\u5927\u5C0F\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.fileSize))), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "session"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u6807\u9898\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.title)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u4F5C\u8005\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.author)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u4E3B\u9898\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.subject)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u5173\u952E\u8BCD\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.keywords)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u521B\u5EFA\u65E5\u671F\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.creationDate)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u4FEE\u6539\u65E5\u671F\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.modificationDate)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u521B\u5EFA\u8005\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.creator))), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "session"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "PDF \u751F\u6210\u5668\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.producer)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "PDF \u7248\u672C\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.version)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u9875\u6570\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.pageCount)), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u9875\u9762\u5927\u5C0F\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.pageSize))), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "session"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "label"
  }, "\u5FEB\u901F Web \u89C6\u56FE\uFF1A"), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "value"
  }, properties == null ? void 0 : properties.isWebView))), /* @__PURE__ */ import_react22.default.createElement("div", {
    className: "btn-wrapper"
  }, /* @__PURE__ */ import_react22.default.createElement(button_default, {
    className: "close-btn",
    onClick: onClose
  }, "\u5173\u95ED")));
};
var property_default = PropertyModal;

// packages/sidebar/index.tsx
var import_react23 = __toESM(require("react"), 1);

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
var Sidebar = ({ children }) => {
  const { sidebarVisible } = usePDFViewer();
  const resizerRef = (0, import_react23.useRef)(null);
  const dragService = (0, import_react23.useMemo)(() => {
    return new SidebarResizer({});
  }, []);
  (0, import_react23.useEffect)(() => {
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
  return /* @__PURE__ */ import_react23.default.createElement("div", {
    id: "__sidebar__",
    className: `${sidebarVisible ? "" : "hidden"}`
  }, /* @__PURE__ */ import_react23.default.createElement("div", {
    id: "__sidebar_content__"
  }, children), /* @__PURE__ */ import_react23.default.createElement("div", {
    id: "__sidebar_resizer__",
    ref: resizerRef
  }));
};
var sidebar_default = Sidebar;

// packages/viewer/index.tsx
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
    setPDFDoc,
    propertyModalVisible,
    setPropertyModalVisible
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();
  const [loading, setLoading] = (0, import_react24.useState)(false);
  const [loadingProgress, setLoadingProgress] = (0, import_react24.useState)(-1);
  const [errorReason, setErrorReason] = (0, import_react24.useState)();
  const loadingTask = (0, import_react24.useRef)(null);
  const viewerRef = (0, import_react24.useRef)(null);
  const scrollElRef = (0, import_react24.useRef)(null);
  const [renderingPageIndex, setRenderingPageIndex] = (0, import_react24.useState)(1);
  const [renderMap, setRenderMap] = (0, import_react24.useState)({});
  const pageSize = usePageResizes({
    resizesRef: viewerRef,
    doc: pdfDoc,
    scale
  });
  (0, import_react24.useEffect)(() => {
    scaleNumberRef.current = pageSize.scale;
  }, [pageSize, scaleNumberRef]);
  (0, import_react24.useEffect)(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);
  (0, import_react24.useEffect)(() => {
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
  const scrollHandler = (0, import_react24.useCallback)(
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
  (0, import_react24.useEffect)(() => {
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
    return /* @__PURE__ */ import_react24.default.createElement("div", {
      id: "__pdf_viewer_container__",
      className: "viewer",
      ref: scrollElRef
    }, pageSize.width == 0 ? null : (0, import_lodash3.range)(0, pdfDoc.numPages).map((index) => {
      const pageIndex = index + 1;
      return /* @__PURE__ */ import_react24.default.createElement(page_layer_default, __spreadProps(__spreadValues({
        key: index,
        pageIndex,
        doc: pdfDoc
      }, pageSize), {
        scrollMode
      }), (doc) => renderingPageIndex < pageIndex && !renderMap[pageIndex] ? /* @__PURE__ */ import_react24.default.createElement(loading_layer_default, null) : [
        /* @__PURE__ */ import_react24.default.createElement(canvas_layer_default, __spreadProps(__spreadValues({}, pageSize), {
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
        /* @__PURE__ */ import_react24.default.createElement(text_layer_default, __spreadProps(__spreadValues({}, pageSize), {
          pageDoc: doc,
          pageIndex,
          key: `text_layer_${pageIndex}`
        })),
        renderingPageIndex <= pageIndex ? /* @__PURE__ */ import_react24.default.createElement(loading_layer_default, {
          key: `loading_layer_${pageIndex}`
        }) : null
      ]);
    }), pageSize.width != 0 && pageSize.height != 0 && /* @__PURE__ */ import_react24.default.createElement(print_default, {
      height: pageSize.vHeight,
      width: pageSize.vWidth,
      pdfDoc
    }));
  }
  return /* @__PURE__ */ import_react24.default.createElement("div", {
    id: "__outer_container__",
    style: { height, width },
    ref: viewerRef,
    className: sidebarVisible ? "sidebar-visible" : ""
  }, /* @__PURE__ */ import_react24.default.createElement(sidebar_default, null, thumbnail && /* @__PURE__ */ import_react24.default.createElement(thumbnail_default, {
    currentPage,
    pdfDoc
  })), contentComponent(), /* @__PURE__ */ import_react24.default.createElement(property_default, {
    visible: propertyModalVisible,
    onClose: () => setPropertyModalVisible(false)
  }));
};
var viewer_default = PDFViewer;

// packages/worker/index.tsx
var import_react25 = __toESM(require("react"), 1);
var PDFWorker = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;
  return /* @__PURE__ */ import_react25.default.createElement(import_react25.default.Fragment, null, children);
};
var worker_default = PDFWorker;
//# sourceMappingURL=index.cjs.map
