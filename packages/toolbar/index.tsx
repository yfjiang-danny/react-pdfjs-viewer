import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { usePDFViewer } from "../provider";
import { useInternalState } from "../provider/internal";
import { ScaleType } from "../types";
import { MAX_SCALE, MIN_SCALE } from "../types/constant";
import "./index.less";
import ScaleSelector from "./scale-selector";

export const TOOLBAR_HEIGHT = 48;

interface ToolbarProps {}

const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
  const { currentPage, setCurrentPage, scale, setScale, totalPage } =
    usePDFViewer();
  const { scaleNumberRef } = useInternalState();

  const [inputPageIndex, setInputPageIndex] = useState(currentPage);

  useEffect(() => {
    setInputPageIndex(currentPage);
  }, [currentPage]);

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

  function onScaleChange(event: ChangeEvent<HTMLSelectElement>): void {
    console.log("onScaleChange", event.currentTarget.value);
    if (!isNaN(Number(event.currentTarget.value))) {
      const scale = parseFloat(event.currentTarget.value);
      setScale(scale);
      return;
    }
    setScale(event.currentTarget.value as ScaleType);
  }

  function onPageInputChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    const v = ev.target.value;
    setInputPageIndex(parseInt(v));
  }

  function scrollToPageIndex(index: number) {
    console.log("scrollToPageIndex", index);

    const scrollEl = document.getElementById("pdf_viewer_container");
    if (scrollEl) {
      const el = document.getElementById(`__page_${index}__`);

      el &&
        scrollEl.scrollTo({
          top: el.offsetTop,
        });
    }
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

  // 缩小
  function onZoomOut(): void {
    setScale(() => {
      const s = scaleNumberRef.current;
      const delta = Math.max(1, Math.floor(s));

      return Math.max(MIN_SCALE, s - delta * 0.1);
    });
  }

  // 放大
  function onZoomIn(): void {
    setScale(() => {
      const s = scaleNumberRef.current;
      const delta = Math.max(1, Math.floor(s));

      return Math.min(MAX_SCALE, s + delta * 0.1);
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="common-button">Search</button>
        <button className="common-button" onClick={onPreviousButtonClick}>
          Previous
        </button>
        <button className="common-button" onClick={onNextButtonClick}>
          Next
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
          <button className="zoom-button zoom-out" onClick={onZoomOut}>
            <span className="zoom-label">缩小</span>
          </button>
          <span className="divider"></span>
          <button className="zoom-button zoom-in" onClick={onZoomIn}>
            <span className="zoom-label">放大</span>
          </button>
        </div>
        <ScaleSelector />
      </div>
      <div className="toolbar-right"></div>
    </div>
  );
};

export default Toolbar;
