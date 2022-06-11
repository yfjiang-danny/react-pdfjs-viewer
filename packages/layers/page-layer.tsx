import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import "../styles/page-layer.less";
import { ScrollMode } from "../types";

interface PageLayerProps {
  pageIndex: number;
  doc: PDFDocumentProxy;
  width: number;
  height: number;
  children: (doc: PDFPageProxy) => ReactNode | ReactNode[];
  scrollMode: ScrollMode;
}

const PageLayer: FunctionComponent<PageLayerProps> = ({
  doc,
  pageIndex,
  width,
  height,
  children,
  scrollMode,
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
          className={`page-layer ${scrollMode}-scroll`}
          id={`__page_${pageIndex}__`}
          style={{
            height: height,
            width: width,
          }}
        >
          {children(pageDoc)}
        </div>
      ) : null}
    </>
  );
};

export default PageLayer;
