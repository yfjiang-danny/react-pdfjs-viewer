import React, { FC, useMemo, useRef } from "react";
import { usePDFViewer } from "../provider";
import { DragService } from "../services/drag-service";
import "../styles/sidebar.less";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const { sidebarVisible } = usePDFViewer();

  const resizerRef = useRef<HTMLDivElement | null>(null);

  const dragService = useMemo(() => {
    return new DragService({});
  }, []);

  return (
    <div id="__sidebar__" className={`${sidebarVisible ? "" : "hidden"}`}>
      <div id="__sidebar_content__">{children}</div>
      <div id="__sidebar_resizer__" ref={resizerRef} />
    </div>
  );
};

export default Sidebar;
