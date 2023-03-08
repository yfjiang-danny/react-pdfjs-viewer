import { XfaLayer } from "pdfjs-dist";
import { AnnotationStorage } from "pdfjs-dist/types/display/annotation_storage";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import { PageViewport } from "pdfjs-dist/types/display/display_utils";

// eslint-disable-next-line @typescript-eslint/ban-types
function getXfaPageViewport(xfaPage: Object | null, arg1: { scale: number }) {
  return new PageViewport({
    viewBox: [0, 0],
    scale: arg1.scale,
    rotation: 0,
  });
}

function getXfaHtmlForPrinting(
  printContainer: HTMLElement,
  pdfDocument: PDFDocumentProxy
) {
  //

  //   const scale = Math.round(PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100;
  for (let i = 0; i < pdfDocument.numPages; i++) {
    pdfDocument.getPage(i).then((pageProxy) => {
      if (pageProxy) {
        pageProxy.getXfa().then((xfaPage) => {
          const page = document.createElement("div");
          page.className = "xfaPrintedPage";
          printContainer.append(page);

          const builder = new XfaLayerBuilder({
            pageDiv: page,
            pdfPage: pageProxy,
            annotationStorage: pdfDocument.annotationStorage,
            linkService: null,
            xfaHtml: xfaPage,
          });
          const viewport = getXfaPageViewport(xfaPage, { scale: 1 });

          builder.render(viewport, "print");
        });
      }
    });
  }
}

interface XfaLayerBuilderOptions {
  pageDiv: HTMLElement;
  pdfPage: PDFPageProxy;
  annotationStorage: AnnotationStorage | null;
  linkService: null;
  xfaHtml: object | null;
}

class XfaLayerBuilder {
  pageDiv: HTMLElement;
  pdfPage: PDFPageProxy;
  annotationStorage: any;
  linkService: any;
  xfaHtml: object | null;
  div: HTMLElement | null;
  _cancelled: boolean;
  /**
   * @param {XfaLayerBuilderOptions} options
   */
  constructor({
    pageDiv,
    pdfPage,
    annotationStorage = null,
    linkService,
    xfaHtml = null,
  }: XfaLayerBuilderOptions) {
    this.pageDiv = pageDiv;
    this.pdfPage = pdfPage;
    this.annotationStorage = annotationStorage;
    this.linkService = linkService;
    this.xfaHtml = xfaHtml;

    this.div = null;
    this._cancelled = false;
  }

  /**
   * @param {PageViewport} viewport
   * @param {string} intent (default value is 'display')
   * @returns {Promise<Object | void>} A promise that is resolved when rendering
   *   of the XFA layer is complete. The first rendering will return an object
   *   with a `textDivs` property that can be used with the TextHighlighter.
   */
  async render(viewport: PageViewport, intent = "display") {
    if (intent === "print") {
      const parameters = {
        viewport: viewport.clone({ dontFlip: true }),
        div: this.div,
        xfaHtml: this.xfaHtml,
        annotationStorage: this.annotationStorage,
        linkService: this.linkService,
        intent,
      };

      // Create an xfa layer div and render the form
      const div = document.createElement("div");
      this.pageDiv.append(div);
      parameters.div = div;

      return XfaLayer.render(parameters);
    }

    // intent === "display"
    const xfaHtml = await this.pdfPage.getXfa();
    if (this._cancelled || !xfaHtml) {
      return { textDivs: [] };
    }

    const parameters = {
      viewport: viewport.clone({ dontFlip: true }),
      div: this.div,
      xfaHtml,
      annotationStorage: this.annotationStorage,
      linkService: this.linkService,
      intent,
    };

    if (this.div) {
      return XfaLayer.update(parameters);
    }
    // Create an xfa layer div and render the form
    this.div = document.createElement("div");
    this.pageDiv.append(this.div);
    parameters.div = this.div;

    return XfaLayer.render(parameters);
  }

  cancel() {
    this._cancelled = true;
  }

  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
}

export { getXfaHtmlForPrinting, XfaLayerBuilder };
