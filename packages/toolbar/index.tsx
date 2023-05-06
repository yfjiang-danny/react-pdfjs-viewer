import { getPdfFilenameFromUrl } from "pdfjs-dist";
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePDFViewer } from "../provider";
import { useInternalState } from "../provider/internal";
import { MAX_SCALE, MIN_SCALE } from "../types/constant";
import { scrollToPageIndex } from "../utils";
import { downloadBlob } from "../utils/download";
import "./index.less";
import ScaleSelector from "./scale-selector";
import Tool, { ToolTypes } from "./tool";

export const TOOLBAR_HEIGHT = 48;

interface ToolbarProps { }

const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
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
    setPropertyModalVisible,
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();

  const [inputPageIndex, setInputPageIndex] = useState(currentPage);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputPageIndex(currentPage);
  }, [currentPage]);

  function onSidebarButtonClick() {
    setSidebarVisible((pre) => !pre);
  }

  function onPreviousButtonClick(): void {
    setCurrentPage((pre) => {
      const res = pre > 1 ? pre - 1 : 1;

      scrollToPageIndex(res);

      return res;
    });
  }

  function onNextButtonClick(): void {
    setCurrentPage((pre) => {
      const res = pre < totalPage ? pre + 1 : totalPage;

      scrollToPageIndex(res);

      return res;
    });
  }

  function onPageInputChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    const v = ev.target.value;
    setInputPageIndex(parseInt(v));
  }

  function onPageInputKeyDown(ev: React.KeyboardEvent): void {
    if (ev.key == "Enter") {
      if (inputPageIndex < 1 || inputPageIndex > totalPage) {
        setInputPageIndex(currentPage);
        return;
      }
      setCurrentPage(inputPageIndex);
      scrollToPageIndex(inputPageIndex);
    }
  }

  function fixed(s: number, d: number): number {
    return parseFloat(s.toFixed(d));
  }

  // 缩小
  function onZoomOut(): void {
    setScale(() => {
      const s = fixed(scaleNumberRef.current, 1);
      const delta = Math.max(1, Math.floor(s));

      return Math.max(MIN_SCALE, fixed(s - delta * 0.1, 2));
    });
  }

  // 放大
  function onZoomIn(): void {
    setScale(() => {
      const s = fixed(scaleNumberRef.current, 1);
      const delta = Math.max(1, Math.floor(s));

      return Math.min(MAX_SCALE, fixed(s + delta * 0.1, 2));
    });
  }

  function onFileInputButtonClicked(): void {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function onFileInputChanged(evt: ChangeEvent<HTMLInputElement>): void {
    const file = evt.currentTarget.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);

      setPdfURI(url);
    }
  }

  function onPrintButtonClick(): void {
    window.print();
  }

  function downloadButtonClick(): void {
    if (!pdfDoc) {
      return;
    }
    pdfDoc.getData().then(
      (data) => {
        const blob = new Blob([data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        blobUrl && downloadBlob(blobUrl, getPdfFilenameFromUrl(pdfURI));
      },
      (err) => {
        alert(err.toString());
      }
    );
  }

  function onToolClick(type: ToolTypes) {
    switch (type) {
      case "property":
        setPropertyModalVisible(true);
        break;

      default:
        break;
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button
          className={`common-button has-before sidebar ${sidebarVisible ? "active" : ""
            }`}
          onClick={onSidebarButtonClick}
        >
          <span className="button-label">切换侧边栏</span>
        </button>
        <button className="common-button has-before search">
          <span className="button-label">查找</span>
        </button>
        <button
          className="common-button has-before previous"
          onClick={onPreviousButtonClick}
        >
          <span className="button-label">上一页</span>
        </button>
        <button
          className="common-button has-before next"
          onClick={onNextButtonClick}
        >
          <span className="button-label">下一页</span>
        </button>
        <div className="page-input-wrapper">
          <input
            className="page-input"
            value={`${inputPageIndex}`}
            onChange={onPageInputChange}
            onKeyDown={onPageInputKeyDown}
            type="number"
            title="页面"
            size={4}
            min={1}
            autoComplete="off"
            max={totalPage}
          />{" "}
          / {totalPage}
        </div>
      </div>
      <div className="toolbar-center">
        <div className="zoom-button-wrapper">
          <button
            className="common-button has-before zoom-button zoom-out"
            onClick={onZoomOut}
          >
            <span className="button-label zoom-label">缩小</span>
          </button>
          <span className="divider"></span>
          <button
            className="common-button has-before zoom-button zoom-in"
            onClick={onZoomIn}
          >
            <span className="button-label zoom-label">放大</span>
          </button>
        </div>
        <ScaleSelector />
      </div>
      <div className="toolbar-right">
        <button
          className="common-button has-before open"
          onClick={onFileInputButtonClicked}
        >
          <span className="button-label">打开</span>
        </button>
        <button
          className="common-button has-before print"
          onClick={onPrintButtonClick}
        >
          <span className="button-label">打印</span>
        </button>
        <button
          className="common-button has-before  download"
          onClick={downloadButtonClick}
        >
          <span className="button-label">保存</span>
        </button>
        <button className="common-button has-before draw">
          <span className="button-label">绘图</span>
        </button>
        <Tool onItemClick={onToolClick} >
          <button className="common-button has-before tools">
            <span className="button-label">工具</span>
          </button>
        </Tool>
      </div>
      <input
        type="file"
        accept=".pdf"
        id="fileInput"
        className="hidden"
        onChange={onFileInputChanged}
        ref={fileInputRef}
      />
    </div>
  );
};

export default Toolbar;
