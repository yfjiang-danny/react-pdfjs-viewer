import { range } from "lodash";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React from "react";
import PDFPage from "../page";

interface PDFDocProps {
  doc: PDFDocumentProxy;
}

const PDFDoc: React.FunctionComponent<PDFDocProps> = (props) => {
  const { doc } = props;

  return (
    <>
      {range(0, doc.numPages - 1).map((index) => {
        return <PDFPage page={index + 1} doc={doc} />;
      })}
    </>
  );
};

export default PDFDoc;
