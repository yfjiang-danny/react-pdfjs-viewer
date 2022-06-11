import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";

enum PageRenderStatus {
  Failed = "FAILED",
  Rendering = "RENDERING",
  Finished = "FINISHED",
  None = "NONE",
}

enum ScrollDirection {
  Backword = "BACKWORD",
  Forward = "FORWARD",
}

class PageViewer {
  pageDoc: PDFPageProxy | null = null;
  pageIndex = -1;
  renderStatus: PageRenderStatus = PageRenderStatus.None;
  constructor(pageDoc: PDFPageProxy, pageIndex: number) {
    this.pageDoc = pageDoc;
    this.pageIndex = pageIndex;
  }

  setRenderStatus(status: PageRenderStatus) {
    this.renderStatus = status;
  }
}

class PDFViewerManager {
  doc: PDFDocumentProxy | null = null;
  pageNum: number = 0;
  renderingPage = -1;
  map: Map<number, PageViewer> = new Map();
  scrollDirection: ScrollDirection = ScrollDirection.Forward;

  constructor(doc: PDFDocumentProxy) {
    this.doc = doc;
    this.pageNum = doc.numPages;
    this.renderingPage = 1;
  }

  onPageRendered(doc: PDFPageProxy, index: number) {
    let pageViewer = this.map.get(index);
    if (!pageViewer) {
      pageViewer = new PageViewer(doc, index);
      pageViewer.setRenderStatus(PageRenderStatus.Finished);
    }
    this.renderNext();
  }

  renderNext() {}
}

export { PDFViewerManager };
