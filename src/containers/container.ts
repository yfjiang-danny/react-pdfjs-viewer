import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { PageViewport } from "pdfjs-dist/types/display/display_utils";
import { useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { TOOLBAR_HEIGHT } from "../components/toolbar";
import { ScaleType } from "../type";
import { scrollIntoView } from "../utils";

interface PDFViewerInitialState {
  initialScale?: number;
  initialPage?: number;
  pdfDoc?: PDFDocumentProxy;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function usePDFViewer(initialState: PDFViewerInitialState = {}) {
  const cache: { [key: number]: boolean } = {};
  const [currentPage, setCurrentPage] = useState(initialState.initialPage || 1);
  const [currentScale, setCurrentScale] = useState<ScaleType>(
    initialState.initialScale || 1.5
  );
  const [actualViewport, setActualViewport] = useState<PageViewport>();
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  const totalPage = useMemo(() => {
    if (!initialState.pdfDoc) {
      return 0;
    }
    return initialState.pdfDoc.numPages;
  }, [initialState.pdfDoc]);

  useEffect(() => {
    if (initialState.pdfDoc && initialState.pdfDoc.numPages > 0) {
      initialState.pdfDoc.getPage(1).then((page) => {
        setActualViewport(page.getViewport({ scale: 1 }));
      });
    }
  }, [initialState.pdfDoc]);

  useEffect(() => {
    const el = document.getElementById(`__page_${currentPage}__`);

    if (el) {
      scrollIntoView(el, { top: -TOOLBAR_HEIGHT });
    }
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    currentScale,
    setCurrentScale,
    totalPage,

    containerEl,
    setContainerEl,
    actualViewport,
    setActualViewport,
  };
}

const PDFViewerContainer = createContainer(usePDFViewer);
export default PDFViewerContainer;
