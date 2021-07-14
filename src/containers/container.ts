import { useState } from "react";
import { createContainer } from "unstated-next";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function usePDFViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentScale, setCurrentScale] = useState(1.5);

  return {
    currentPage,
    setCurrentPage,
    currentScale,
    setCurrentScale,
  };
}

const PDFViewerContainer = createContainer(usePDFViewer);
export default PDFViewerContainer;
