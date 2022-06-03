import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
} from "pdfjs-dist/types/display/api";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { PDFLib } from "../vendors/lib";
import PDFWorker from "../worker";

interface PDFViewerProps {
  pdfURI: string;
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
}

const PDFViewer: React.FunctionComponent<PDFViewerProps> = ({
  pdfURI,
  loadingComponent,
  errorComponent,
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
    return <></>;
  }

  return (
    <div id="pdf_viewer_container" className="pdf-viewer-container">
      {contentComponent()}
    </div>
  );
};

export default PDFViewer;
