import { useState } from "react";

const map = new Map<number, boolean>();
function useRenderManager() {
  const [renderingPageIndex, setRenderingPageIndex] = useState(-1);

  function renderNext(index: number) {
    setRenderingPageIndex((pre) => pre + 1);
  }

  return {
    renderingPageIndex,
    map,
  };
}

export { useRenderManager };
