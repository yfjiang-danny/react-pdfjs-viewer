import React from "react";
import PDFViewerContainer from "../../containers/container";
import Select from "../selector";
import "./index.scss"

export const TOOLBAR_HEIGHT = 48;

interface ToolbarProps {
  zoom?: boolean;
  scale?: boolean;
  pagination?: boolean;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {

  const { currentPage, setCurrentPage, totalPage } = PDFViewerContainer.useContainer();

  function onPreviousButtonClick(): void {
    setCurrentPage((pre) => {
      return pre > 1 ? pre - 1 : 1
    })
  }

  function onNextButtonClick(): void {
    setCurrentPage((pre) => {
      return pre < totalPage ? pre + 1 : totalPage
    })
  }

  return <div className="toolbar" >
    <div className="left-button-container" >
      <button className="common-button" >Search</button>
      <button className="common-button" onClick={onPreviousButtonClick} >Previous</button>
      <button className="common-button" onClick={onNextButtonClick} >Next</button>
    </div>
    <div className="middle-button-container" >
      <Select>
        <option value="auto">自动缩放</option>
        <option value="actual">实际大小</option>
        <option value="fit_page">适合页面</option>
        <option value="fit_page_width">适合页宽</option>
        <option value="50">50%</option>
        <option value="75">75%</option>
        <option value="100">100%</option>
        <option value="125">125%</option>
        <option value="150">150%</option>
        <option value="200">200%</option>
        <option value="300">300%</option>
        <option value="400">400%</option>
      </Select>
    </div>
    <div></div>
  </div>;
};

export default Toolbar;
