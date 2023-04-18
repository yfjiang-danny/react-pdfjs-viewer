import { PDFPageProxy } from "pdfjs-dist/types/display/api";
declare function parseFileSize(fileSize?: number): string | undefined;
declare function parseDate(inputDate: string): string | undefined;
/**
 * Gets the size of the specified page, converted from PDF units to inches.
 * @param {GetPageSizeInchesParameters} params
 * @returns {PageSize}
 */
declare function getPageSizeInches({ view, userUnit, rotate }: PDFPageProxy): {
    width: number;
    height: number;
};
export { parseFileSize, parseDate, getPageSizeInches };
