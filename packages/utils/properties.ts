import { PDFDateString } from "pdfjs-dist";
import { PDFPageProxy } from "pdfjs-dist/types/display/api";

function parseFileSize(fileSize = 0): string | undefined {
  const kb = fileSize / 1024,
    mb = kb / 1024;
  if (!kb) {
    return undefined;
  }

  return mb > 1
    ? `${+mb.toPrecision(3)}mb`
    : `${mb < 1 && +kb.toPrecision(3)}kb`;
}

function parseDate(inputDate: string): string | undefined {
  const dateObject = PDFDateString.toDateObject(inputDate);
  if (!dateObject) {
    return undefined;
  }
  return dateObject.toLocaleDateString();
}

/**
 * Gets the size of the specified page, converted from PDF units to inches.
 * @param {GetPageSizeInchesParameters} params
 * @returns {PageSize}
 */
function getPageSizeInches({ view, userUnit, rotate }: PDFPageProxy) {
  const [x1, y1, x2, y2] = view;
  // We need to take the page rotation into account as well.
  const changeOrientation = rotate % 180 !== 0;

  const width = ((x2 - x1) / 72) * userUnit;
  const height = ((y2 - y1) / 72) * userUnit;

  return {
    width: changeOrientation ? height : width,
    height: changeOrientation ? width : height,
  };
}

export { parseFileSize, parseDate, getPageSizeInches };
