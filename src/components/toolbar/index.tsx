import React from "react";
import "./index.css"

interface ToolbarProps {
  zoom?: boolean;
  scale?: boolean;
  pagination?: boolean;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  return <div className="toolbar" >Toolbar Component</div>;
};

export default Toolbar;
