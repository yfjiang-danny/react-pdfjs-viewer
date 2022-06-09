import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface PageLayerProps {
  pageIndex: number;
  doc: PDFDocumentProxy;
  width: number;
  height: number;
  children: (doc: PDFPageProxy) => ReactNode | ReactNode[];
}

const PageLayer: FunctionComponent<PageLayerProps> = ({
  doc,
  pageIndex,
  width,
  height,
  children,
}) => {
  const [pageDoc, setPageDoc] = useState<PDFPageProxy>();

  useEffect(() => {
    doc.getPage(pageIndex).then((pageDoc) => {
      setPageDoc(pageDoc);
    });
  }, [pageIndex, doc]);

  return (
    <>
      {pageDoc ? (
        <div
          id={`__page_${pageIndex}__`}
          style={{
            height: height,
            width: width,
            margin: "auto",
            position: "relative",
          }}
        >
          {children(pageDoc)}
        </div>
      ) : null}
    </>
  );
};

export default PageLayer;
