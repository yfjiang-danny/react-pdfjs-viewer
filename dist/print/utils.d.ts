import { AnnotationStorage } from "pdfjs-dist/types/display/annotation_storage";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import { PageViewport } from "pdfjs-dist/types/display/display_utils";
declare function getXfaHtmlForPrinting(printContainer: HTMLElement, pdfDocument: PDFDocumentProxy): void;
interface XfaLayerBuilderOptions {
    pageDiv: HTMLElement;
    pdfPage: PDFPageProxy;
    annotationStorage: AnnotationStorage | null;
    linkService: null;
    xfaHtml: object | null;
}
declare class XfaLayerBuilder {
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
    constructor({ pageDiv, pdfPage, annotationStorage, linkService, xfaHtml, }: XfaLayerBuilderOptions);
    /**
     * @param {PageViewport} viewport
     * @param {string} intent (default value is 'display')
     * @returns {Promise<Object | void>} A promise that is resolved when rendering
     *   of the XFA layer is complete. The first rendering will return an object
     *   with a `textDivs` property that can be used with the TextHighlighter.
     */
    render(viewport: PageViewport, intent?: string): Promise<void | {
        textDivs: never[];
    }>;
    cancel(): void;
    hide(): void;
}
export { getXfaHtmlForPrinting, XfaLayerBuilder };
