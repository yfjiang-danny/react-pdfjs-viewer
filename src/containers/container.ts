import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { TOOLBAR_HEIGHT } from "../components/toolbar";
import { scrollIntoView } from "../utils";

interface PDFViewerInitialState {
  initialScale?: number;
  initialPage?: number;
  pdfDoc?: PDFDocumentProxy;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function usePDFViewer(initialState: PDFViewerInitialState = {
}) {
  const [currentPage, setCurrentPage] = useState(initialState.initialPage || 1);
  const [currentScale, setCurrentScale] = useState(initialState.initialScale || 1.5);

  const totalPage = useMemo(() => {
    if (!initialState.pdfDoc) {
      return 0
    }
    return initialState.pdfDoc.numPages
  }, [initialState.pdfDoc])

  useEffect(() => {
    const el = document.getElementById(`__page_${currentPage}__`)

    if (el) {
      scrollIntoView(el, { top: -TOOLBAR_HEIGHT })
    }
  }, [currentPage])

  return {
    currentPage,
    setCurrentPage,
    currentScale,
    setCurrentScale,
    totalPage,
  };
}

const PDFViewerContainer = createContainer(usePDFViewer);
export default PDFViewerContainer;
