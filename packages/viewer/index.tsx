import { range } from "lodash";
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/display/api";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import CanvasLayer from "../layers/canvas-layer";
import PageLayer from "../layers/page-layer";
import TextLayer from "../layers/text-layer";
import { PageSize, ScaleType, ScrollMode } from "../types";
import { PDFLib } from "../vendors/lib";
import "../styles/viewer.less";
import { usePageResizer } from "../hooks/usePageResize";

interface PDFViewerProps {
  pdfURI: string;
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
  scale: ScaleType;
  width: string | number;
  height: string | number;
  scrollMode?: ScrollMode;
}

const PDFViewer: FC<PDFViewerProps> = ({
  pdfURI,
  loadingComponent,
  errorComponent,
  scale,
  width,
  height,
  scrollMode = "vertical",
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(-1);
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [errorReason, setErrorReason] = useState<any>();
  const loadingTask = useRef<PDFDocumentLoadingTask | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [renderingPageIndex, setRenderingPageIndex] = useState(-1);

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
        })
        .catch((reason) => {
          setErrorReason(reason);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pdfURI]);

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
          : range(0, pdfDoc.numPages - 1).map((index) => {
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
                    renderingPageIndex < pageIndex
                      ? null
                      : [
                          <CanvasLayer
                            {...pageSize}
                            pageDoc={doc}
                            pageIndex={pageIndex}
                            key={`canvas_layer_${pageIndex}`}
                            onCompleted={() => {
                              setRenderingPageIndex((pre) => pre + 1);
                            }}
                          />,
                          <TextLayer
                            {...pageSize}
                            pageDoc={doc}
                            pageIndex={pageIndex}
                            key={`text_layer_${pageIndex}`}
                          />,
                        ]
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
