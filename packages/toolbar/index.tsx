import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { usePDFViewer } from "../provider";
import Select from "../share/selector";
import { ScaleType } from "../types";
import "./index.less";

export const TOOLBAR_HEIGHT = 48;

interface ToolbarProps {}

const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
  const { currentPage, setCurrentPage, scale, setScale, totalPage } =
    usePDFViewer();

  const [inputPageIndex, setInputPageIndex] = useState(currentPage);

  useEffect(() => {
    setInputPageIndex(currentPage);
  }, [currentPage]);

  function onPreviousButtonClick(): void {
    console.log(3333);

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

  function onZoomOut(): void {
    // TODO:
  }

  function onZoomIn(): void {
    // TODO:
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
        <div>
          <button className="zoom-button zoom-out" onClick={onZoomOut}>
            -
          </button>
          <span className="divider"></span>
          <button className="zoom-button zoom-in" onClick={onZoomIn}>
            +
          </button>
        </div>
        <Select control value={`${scale}`} onChange={onScaleChange}>
          <option value="auto">自动缩放</option>
          <option value="fitWidth">适合页宽</option>
          <option value="fitHeight">适合页面</option>
          <option value="0.5">50%</option>
          <option value="0.75">75%</option>
          <option value="1">100%</option>
          <option value="1.25">125%</option>
          <option value="1.5">150%</option>
          <option value="2">200%</option>
          <option value="3">300%</option>
          <option value="4">400%</option>
        </Select>
      </div>
      <div className="toolbar-right"></div>
    </div>
  );
};

export default Toolbar;
