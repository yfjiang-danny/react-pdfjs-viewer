import { range } from "lodash";
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/display/api";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { usePageResizer } from "../hooks/usePageResize";
import CanvasLayer from "../layers/canvas-layer";
import LoadingLayer from "../layers/loading-layer";
import PageLayer from "../layers/page-layer";
import TextLayer from "../layers/text-layer";
import { usePDFViewer } from "../provider";
import "../styles/viewer.less";
import { ScrollMode } from "../types";
import { ScrollState, watchScroll } from "../utils";
import { PDFLib } from "../vendors/lib";

interface PDFViewerProps {
  pdfURI: string;
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
  width: string | number;
  height: string | number;
  scrollMode?: ScrollMode;
}

const PDFViewer: FC<PDFViewerProps> = ({
  pdfURI,
  loadingComponent,
  errorComponent,
  width,
  height,
  scrollMode = "vertical",
}) => {
  const { scale, totalPage, currentPage, setCurrentPage, setTotalPage } =
    usePDFViewer();

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(-1);
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [errorReason, setErrorReason] = useState<any>();
  const loadingTask = useRef<PDFDocumentLoadingTask | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState(1);
  const [renderMap, setRenderMap] = useState<{ [key: number]: boolean }>({});

  const pageSize = usePageResizer({
    resizerRef: viewerRef,
    doc: pdfDoc,
    scale: scale,
  });

  useEffect(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);

  useEffect(() => {
    if (pdfURI) {
      loadingTask.current = PDFLib.getDocument(pdfURI);

      loadingTask.current.onProgress = (progress: number) => {
        setLoadingProgress(progress);
      };

      loadingTask.current.promise
        .then((pdf: PDFDocumentProxy) => {
          setPDFDoc(pdf);
          setTotalPage(pdf.numPages);
        })
        .catch((reason) => {
          setErrorReason(reason);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pdfURI]);

  function scrollHandler(state: ScrollState) {
    if (scrollMode == "vertical") {
      if (pageSize.height == 0) {
        return;
      }
      const r = state.lastY % pageSize.height;
      let d = Math.floor(state.lastY / pageSize.height) + 1;
      const pageIndex =
        r > pageSize.height / 2 ? Math.min(d + 1, totalPage) : d;
      setCurrentPage((pre) => {
        if (pre == pageIndex) {
          return pre;
        }
        return pageIndex;
      });
      return;
    }
    if (pageSize.width == 0) {
      return;
    }
    const r = state.lastX % pageSize.width;
    let d = Math.floor(state.lastX / pageSize.width) + 1;
    const page = r > pageSize.height / 2 ? Math.min(d + 1, totalPage) : d;
    setCurrentPage((pre) => {
      if (pre == page) {
        return pre;
      }
      return page;
    });
  }

  useEffect(() => {
    let scrollState: ScrollState | null = null;
    if (viewerRef.current) {
      scrollState = watchScroll(viewerRef.current, scrollHandler);
    }
    return () => {
      scrollState && scrollState.remove();
    };
  }, [scrollHandler]);

  function contentComponent(): ReactNode {
    if (!pdfURI) {
      // TODO: Error
      return "请输入 PDF";
    }
    if (loading) {
      return typeof loadingComponent == "function"
        ? loadingComponent(loadingProgress)
        : loadingComponent;
    }
    if (errorReason || !pdfDoc) {
      return typeof errorComponent == "function"
        ? errorComponent(errorReason)
        : errorComponent;
    }
    return (
      <div>
        {pageSize.width == 0
          ? null
          : range(0, pdfDoc.numPages).map((index) => {
              const pageIndex = index + 1;
              return (
                <PageLayer
                  key={index}
                  pageIndex={pageIndex}
                  doc={pdfDoc}
                  {...pageSize}
                  scrollMode={scrollMode}
                >
                  {(doc: PDFPageProxy) =>
                    renderingPageIndex < pageIndex && !renderMap[pageIndex] ? (
                      <LoadingLayer />
                    ) : (
                      [
                        <CanvasLayer
                          {...pageSize}
                          pageDoc={doc}
                          pageIndex={pageIndex}
                          renderingIndex={renderingPageIndex}
                          key={`canvas_layer_${pageIndex}`}
                          onCompleted={() => {
                            setRenderingPageIndex((pre) => pre + 1);
                            setRenderMap((pre) => {
                              if (pre[pageIndex]) {
                                return pre;
                              }
                              return {
                                ...pre,
                                pageIndex: true,
                              };
                            });
                          }}
                        />,
                        <TextLayer
                          {...pageSize}
                          pageDoc={doc}
                          pageIndex={pageIndex}
                          key={`text_layer_${pageIndex}`}
                        />,
                        renderingPageIndex <= pageIndex ? (
                          <LoadingLayer key={`loading_layer_${pageIndex}`} />
                        ) : null,
                      ]
                    )
                  }
                </PageLayer>
              );
            })}
      </div>
    );
  }

  return (
    <div
      id="pdf_viewer_container"
      className="viewer"
      style={{ height: height, width: width }}
      ref={viewerRef}
    >
      {contentComponent()}
    </div>
  );
};

export default PDFViewer;
