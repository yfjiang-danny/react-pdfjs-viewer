import React, { FC } from "react";
import "../styles/sidebar.less";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return <div id="__sidebar__">{children}</div>;
};

export default Sidebar;
