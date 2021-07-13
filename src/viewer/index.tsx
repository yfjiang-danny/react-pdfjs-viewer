import * as PDFLib from "pdfjs-dist/legacy/build/pdf";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { ReactNode, useEffect, useState } from "react";
import PDFDoc from "../components/pdf-doc";

interface ViewerProps {
  pdfURI: string;
}

export function Viewer(props: ViewerProps) {
  const { pdfURI } = props;

  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pdfURI) {
      setLoading(true);
      PDFLib.getDocument(pdfURI).promise.then(
        (pdf: PDFDocumentProxy) => {
          setLoading(false);
          setPDFDoc(pdf);
        },
        () => {
          setLoading(false);
        }
      );
    }
  }, [pdfURI]);

  function contentComponent(): ReactNode {
    if (!pdfURI) {
      // TODO: Error
      return null;
    }
    if (loading || !pdfDoc) {
      // TODO: Loading
      return null;
    }
    return <PDFDoc doc={pdfDoc} />;
  }

  return <>{contentComponent()}</>;
}
