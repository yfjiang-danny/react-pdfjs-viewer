import { range } from "lodash";
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/display/api";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePageResizes } from "../hooks/usePageResize";
import CanvasLayer from "../layers/canvas-layer";
import LoadingLayer from "../layers/loading-layer";
import PageLayer from "../layers/page-layer";
import TextLayer from "../layers/text-layer";
import Print from "../print";
import { usePDFViewer } from "../provider";
import { useInternalState } from "../provider/internal";
import Sidebar from "../sidebar";
import "../styles/index.less";
import "../styles/viewer.less";
import Thumbnail from "../thumbnail";
import { ScrollMode } from "../types";
import { ScrollState, watchScroll } from "../utils";
import { PDFLib } from "../vendors/lib";

interface PDFViewerProps {
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
  width: string | number;
  height: string | number;
  scrollMode?: ScrollMode;
  thumbnail?: boolean;
}

const PDFViewer: FC<PDFViewerProps> = ({
  loadingComponent,
  errorComponent,
  width,
  height,
  scrollMode = "vertical",
  thumbnail = true,
}) => {
  const {
    pdfURI,
    scale,
    totalPage,
    currentPage,
    setCurrentPage,
    setTotalPage,
    sidebarVisible,
  } = usePDFViewer();
  const { scaleNumberRef } = useInternalState();

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(-1);
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [errorReason, setErrorReason] = useState<any>();
  const loadingTask = useRef<PDFDocumentLoadingTask | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState(1);
  const [renderMap, setRenderMap] = useState<{ [key: number]: boolean }>({});

  const pageSize = usePageResizes({
    resizesRef: viewerRef,
    doc: pdfDoc,
    scale: scale,
  });

  useEffect(() => {
    scaleNumberRef.current = pageSize.scale;
  }, [pageSize, scaleNumberRef]);

  useEffect(() => {
    setRenderingPageIndex(1);
  }, [pageSize]);

  useEffect(() => {
    if (pdfURI) {
      setErrorReason(undefined);
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

    return () => {
      loadingTask.current && loadingTask.current.destroy();
    };
  }, [pdfURI]);

  const scrollHandler = useCallback(
    (state: ScrollState) => {
      if (scrollMode == "vertical") {
        if (pageSize.height == 0) {
          return;
        }
        const r = state.lastY % pageSize.height;
        const d = Math.floor(state.lastY / pageSize.height) + 1;
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
      const d = Math.floor(state.lastX / pageSize.width) + 1;
      const page = r > pageSize.height / 2 ? Math.min(d + 1, totalPage) : d;

      setCurrentPage((pre) => {
        if (pre == page) {
          return pre;
        }
        return page;
      });
    },
    [pageSize.height, pageSize.width, scrollMode, setCurrentPage, totalPage]
  );

  // function scrollHandler

  useEffect(() => {
    let scrollState: ScrollState | null = null;
    if (scrollElRef.current) {
      scrollState = watchScroll(scrollElRef.current, scrollHandler);
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

    if (!pdfDoc) {
      if (errorReason) {
        return typeof errorComponent == "function"
          ? errorComponent(errorReason)
          : errorComponent ?? errorReason.toString();
      }
      return "Waiting...";
    }

    return (
      <div id="__pdf_viewer_container__" className="viewer" ref={scrollElRef}>
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
        {pageSize.width != 0 && pageSize.height != 0 && (
          <Print
            height={pageSize.height}
            width={pageSize.width}
            pdfDoc={pdfDoc}
            scale={pageSize.scale}
          />
        )}
      </div>
    );
  }

  return (
    <div
      id="__outer_container__"
      style={{ height: height, width: width }}
      ref={viewerRef}
      className={sidebarVisible ? "sidebar-visible" : ""}
    >
      <Sidebar>
        {thumbnail && <Thumbnail currentPage={currentPage} pdfDoc={pdfDoc} />}
      </Sidebar>
      {contentComponent()}
    </div>
  );
};

export default PDFViewer;
