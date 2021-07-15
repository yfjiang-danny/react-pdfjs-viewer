import { range } from "lodash";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React from "react";
import PDFPage from "../page";
import "./index.css"

interface PDFDocProps {
  doc: PDFDocumentProxy;
}

const PDFDoc: React.FunctionComponent<PDFDocProps> = (props) => {
  const { doc } = props;

  return (
    <div className="doc" >
      {range(0, doc.numPages - 1).map((index) => {
        return <PDFPage key={index} page={index + 1} doc={doc} />;
      })}
    </div>
  );
};

export default PDFDoc;
