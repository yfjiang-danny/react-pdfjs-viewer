import * as PDFLib from "pdfjs-dist";
export { PDFLib };

type ScaleStringType = "auto" | "fitWidth" | "fitHeight";
export type ScaleType = ScaleStringType | number;

export const DEFAULT_SCALE_VALUE = "auto";
export const DEFAULT_SCALE = 1.0;
export const DEFAULT_SCALE_DELTA = 1.1;
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10.0;
export const UNKNOWN_SCALE = 0;
export const MAX_AUTO_SCALE = 1.25;
export const SCROLLBAR_PADDING = 40;
export const VERTICAL_PADDING = 5;

export const PixelsPerInch = {
  CSS: 96.0,
  PDF: 72.0,

  /** @type {number} */
  get PDF_TO_CSS_UNITS() {
    return PDFLib.shadow(this, "PDF_TO_CSS_UNITS", this.CSS / this.PDF);
  },
};
