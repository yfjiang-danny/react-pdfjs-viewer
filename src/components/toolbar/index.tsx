import React from "react";
import PDFViewerContainer from "../../containers/container";
import { ScaleType } from "../../type";
import Select from "../selector";
import "./index.scss";

export const TOOLBAR_HEIGHT = 48;

interface ToolbarProps {
  zoom?: boolean;
  scale?: boolean;
  pagination?: boolean;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  const { setCurrentPage, totalPage, currentScale, setCurrentScale } =
    PDFViewerContainer.useContainer();

  function onPreviousButtonClick(): void {
    setCurrentPage((pre) => {
      return pre > 1 ? pre - 1 : 1;
    });
  }

  function onNextButtonClick(): void {
    setCurrentPage((pre) => {
      return pre < totalPage ? pre + 1 : totalPage;
    });
  }

  function onScaleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    console.log("onScaleChange", event.currentTarget.value);
    if (!isNaN(Number(event.currentTarget.value))) {
      const scale = parseFloat(event.currentTarget.value);
      setCurrentScale(scale);
      return;
    }
    setCurrentScale(event.currentTarget.value as ScaleType);
  }

  return (
    <div className="toolbar">
      <div className="left-button-container">
        <button className="common-button">Search</button>
        <button className="common-button" onClick={onPreviousButtonClick}>
          Previous
        </button>
        <button className="common-button" onClick={onNextButtonClick}>
          Next
        </button>
      </div>
      <div className="middle-button-container">
        <Select control value={`${currentScale}`} onChange={onScaleChange}>
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
      <div></div>
    </div>
  );
};

export default Toolbar;
