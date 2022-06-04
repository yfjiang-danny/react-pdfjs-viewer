import * as PDFLib from "pdfjs-dist/legacy/build/pdf";
import React, { useState } from "react";

export interface PDFWorkerProps {
  workerDir: string;
}

const PDFWorker: React.FC<PDFWorkerProps> = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;

  return <>{children}</>;
};

export default PDFWorker;
