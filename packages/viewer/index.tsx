import { range } from "lodash";
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/display/api";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import CanvasLayer from "../layers/canvas-layer";
import PageLayer from "../layers/page-layer";
import Resizer from "../resizer";
import { PageSize, ScaleType } from "../types";
import { PDFLib } from "../vendors/lib";

interface PDFViewerProps {
  pdfURI: string;
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
  scale: ScaleType;
}

const PDFViewer: FC<PDFViewerProps> = ({
  pdfURI,
  loadingComponent,
  errorComponent,
  scale,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(-1);
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [errorReason, setErrorReason] = useState<any>();
  const loadingTask = useRef<PDFDocumentLoadingTask | null>(null);

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
      <Resizer doc={pdfDoc} scale={scale}>
        {(pageSize: PageSize) => (
          <>
            {range(0, pdfDoc.numPages - 1).map((index) => {
              return (
                <PageLayer
                  key={index}
                  pageIndex={index + 1}
                  doc={pdfDoc}
                  {...pageSize}
                >
                  {(doc: PDFPageProxy) => [
                    <CanvasLayer
                      {...pageSize}
                      pageDoc={doc}
                      pageIndex={index}
                    />,
                  ]}
                </PageLayer>
              );
            })}
          </>
        )}
      </Resizer>
    );
  }

  return (
    <div id="pdf_viewer_container" className="pdf-viewer-container">
      {contentComponent()}
    </div>
  );
};

export default PDFViewer;
