import React, { FC, useEffect, useMemo, useRef } from "react";
import { usePDFViewer } from "../provider";
import "../styles/sidebar.less";
import { SidebarResizer } from "./resizer";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const { sidebarVisible } = usePDFViewer();

  const resizerRef = useRef<HTMLDivElement | null>(null);

  const dragService = useMemo(() => {
    return new SidebarResizer({});
  }, []);

  useEffect(() => {
    console.log("dragService", dragService);

    dragService?.addDragSource({
      element: resizerRef,
    });

    return () => {
      dragService?.removeDragSource({
        element: resizerRef,
      });
    };
  }, [dragService, resizerRef]);

  return (
    <div id="__sidebar__" className={`${sidebarVisible ? "" : "hidden"}`}>
      <div id="__sidebar_content__">{children}</div>
      <div id="__sidebar_resizer__" ref={resizerRef} />
    </div>
  );
};

export default Sidebar;
