import * as PDFLib from "pdfjs-dist/legacy/build/pdf";
import React from "react";

export interface PDFWorkerProps {
  workerDir: string;
}

const PDFWorker: React.FC<PDFWorkerProps> = (props) => {
  PDFLib.GlobalWorkerOptions.workerSrc = props.workerDir;

  return <>{props.children}</>;
};

export default PDFWorker;
