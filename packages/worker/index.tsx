import React, { FC } from "react";
import { PDFLib } from "../vendors/lib";

export interface PDFWorkerProps {
  workerDir: string;
}

const PDFWorker: FC<PDFWorkerProps> = ({ workerDir, children }) => {
  PDFLib.GlobalWorkerOptions.workerSrc = workerDir;

  return <>{children}</>;
};

export default PDFWorker;
