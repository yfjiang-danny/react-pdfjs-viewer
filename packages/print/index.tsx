import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { FC } from "react";

interface PrintProps {
  width: number;
  height: number;
  doc: PDFDocumentProxy;
}

const Print: FC<PrintProps> = (props) => {
  return <>Print Component</>;
};

export default Print;
