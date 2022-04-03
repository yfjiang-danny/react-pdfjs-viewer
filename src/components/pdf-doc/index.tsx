import { range } from "lodash";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { useCallback, useEffect } from "react";
import PDFViewerContainer from "../../containers/container";
import PDFPage from "../page";
import "./index.scss";

interface PDFDocProps {
  doc: PDFDocumentProxy;
}

const PDFDoc: React.FunctionComponent<PDFDocProps> = (props) => {
  const { doc } = props;

  const { setContainerEl } = PDFViewerContainer.useContainer();

  const ref = useCallback(
    (el) => {
      if (el) {
        setContainerEl(el);
      }
    },
    [setContainerEl]
  );

  return (
    <div className="doc" id="doc" ref={ref}>
      {range(0, doc.numPages - 1).map((index) => {
        return <PDFPage key={index} page={index + 1} doc={doc} />;
      })}
    </div>
  );
};

export default PDFDoc;
