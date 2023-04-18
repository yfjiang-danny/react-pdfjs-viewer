import { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import { PDFLib } from "../vendors/lib";

interface PDFLoaderProps {
  pdfURI: string;
  errorComponent?: ((reason: any) => ReactNode) | ReactNode;
  loadingComponent?: ((progress: number) => ReactNode) | ReactNode;
  children: (pdfDoc: PDFDocumentProxy) => ReactNode | ReactNode[];
}

const PDFLoader: FunctionComponent<PDFLoaderProps> = ({ pdfURI, errorComponent, loadingComponent, children }) => {

  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [errorReason, setErrorReason] = useState<any>();
  const loadingTask = useRef<PDFDocumentLoadingTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(-1);

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

  function contentComponent() {
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

    return children(pdfDoc);
  }


  return <>{contentComponent()}</>;
};

export default PDFLoader;
