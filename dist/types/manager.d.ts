import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
declare enum PageRenderStatus {
    Failed = "FAILED",
    Rendering = "RENDERING",
    Finished = "FINISHED",
    None = "NONE"
}
declare enum ScrollDirection {
    Backword = "BACKWORD",
    Forward = "FORWARD"
}
declare class PageViewer {
    pageDoc: PDFPageProxy | null;
    pageIndex: number;
    renderStatus: PageRenderStatus;
    constructor(pageDoc: PDFPageProxy, pageIndex: number);
    setRenderStatus(status: PageRenderStatus): void;
}
declare class PDFViewerManager {
    doc: PDFDocumentProxy | null;
    pageNum: number;
    renderingPage: number;
    map: Map<number, PageViewer>;
    scrollDirection: ScrollDirection;
    queue: never[];
    constructor(doc: PDFDocumentProxy);
    onPageRendered(doc: PDFPageProxy, index: number): void;
    renderNext(index?: number): void;
}
export { PDFViewerManager };
