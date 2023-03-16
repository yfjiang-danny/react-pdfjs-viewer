import { range } from "lodash";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import React, { FC } from "react";
import { createPortal } from "react-dom";
import ThumbnailItem from "./item";

interface PrintProps {
  width: number;
  height: number;
  pdfDoc: PDFDocumentProxy;
}

const Print: FC<PrintProps> = ({ pdfDoc, width, height }) => {
  const container = React.useMemo(() => {
    const id = "__print_container__";
    let containerEl = document.getElementById(`${id}`);
    if (containerEl) {
      return containerEl;
    }

    containerEl = document.createElement("div");
    containerEl.id = id;

    document.body.appendChild(containerEl);
    return containerEl;
  }, []);

  return createPortal(
    <>
      <div id="__print_view__">
        {!pdfDoc
          ? null
          : range(0, pdfDoc.numPages).map((index) => {
              const pageIndex = index + 1;
              return (
                <ThumbnailItem
                  key={pageIndex}
                  pdfDoc={pdfDoc}
                  pageIndex={pageIndex}
                  width={width}
                  height={height}
                />
              );
            })}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@page { size: ${width}pt ${height}pt }`,
        }}
      ></style>
    </>,
    container
  );
};

export default Print;
