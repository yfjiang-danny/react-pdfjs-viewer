/**
 * Scrolls specified element into view of its parent by element id.
 * @param id
 */
declare function scrollIntoViewByID(id: string): void;
/**
 * Scrolls specified element into view of its parent.
 * @param {Object} element - The element to be visible.
 * @param {Object} spot - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {boolean} [scrollMatches] - When scrolling search results into view,
 *   ignore elements that either: Contains marked content identifiers,
 *   or have the CSS-rule `overflow: hidden;` set. The default value is `false`.
 */
declare function scrollIntoView(element: HTMLElement, spot?: {
    top?: number;
    left?: number;
}, scrollMatches?: boolean): void;
interface ScrollState {
    right: boolean;
    down: boolean;
    lastX: number;
    lastY: number;
    _eventHandler(evt: Event): void;
    remove(): void;
}
/**
 * Helper function to start monitoring the scroll event and converting them into
 * PDF.js friendly one: with scroll debounce and scroll direction.
 */
declare function watchScroll(viewAreaElement: HTMLElement, callback: (st: ScrollState) => void): ScrollState;
/**
 *  Approximates float number as a fraction using Farey sequence (max order
 *  of 8).
 *  @param {number} x - Positive float number.
 *  @returns {Array} Estimated fraction: the first array item is a numerator,
 *                   the second one is a denominator.
 */
declare function approximateFraction(x: number): number[];
/**
 * 获取不小于 x 并且能够被 div 整除的最大整数
 * @param x
 * @param div
 * @returns
 */
declare function roundToDivide(x: number, div: number): number;
declare function scrollToPageIndex(index: number): void;
export { roundToDivide, approximateFraction, watchScroll, scrollIntoView, scrollIntoViewByID, ScrollState, scrollToPageIndex, };
