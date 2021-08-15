import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, { useEffect, useState } from "react";
import PDFCanvas from "../canvas";

interface PDFPageProps {
  page: number;
  doc: PDFDocumentProxy;
}

const PDFPage: React.FunctionComponent<PDFPageProps> = (props) => {
  const { page, doc } = props;

  const [pageDoc, setPageDoc] = useState<PDFPageProxy>();

  useEffect(() => {
    doc.getPage(page).then((pageDoc) => {
      setPageDoc(pageDoc);
    });
  }, [page, doc]);

  return <>{pageDoc ? <div id={`__page_${page}__`} ><PDFCanvas pageDoc={pageDoc} /></div> : null}</>;
};

export default PDFPage;
