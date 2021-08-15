/**
 * Scrolls specified element into view of its parent.
 * @param {Object} element - The element to be visible.
 * @param {Object} spot - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {boolean} [scrollMatches] - When scrolling search results into view,
 *   ignore elements that either: Contains marked content identifiers,
 *   or have the CSS-rule `overflow: hidden;` set. The default value is `false`.
 */
export function scrollIntoView(element: HTMLElement, spot?: { top?: number, left?: number }, scrollMatches = false) {
    // Assuming offsetParent is available (it's not available when viewer is in
    // hidden iframe or object). We have to scroll: if the offsetParent is not set
    // producing the error. See also animationStarted.
    let parent = element.offsetParent;
    if (!parent) {
        console.error("offsetParent is not set -- cannot scroll");
        return;
    }
    let offsetY = element.offsetTop + element.clientTop;
    let offsetX = element.offsetLeft + element.clientLeft;
    while (
        (parent.clientHeight === parent.scrollHeight &&
            parent.clientWidth === parent.scrollWidth)) {

        if ((parent.tagName.toUpperCase()) === "BODY") {
            break;
        }

        offsetY += (parent as HTMLElement).offsetTop;
        offsetX += (parent as HTMLElement).offsetLeft;

        parent = (parent as HTMLElement).offsetParent;
        if (!parent) {
            return; // no need to scroll
        }
    }
    if (spot) {
        if (spot.top !== undefined) {
            offsetY += spot.top;
        }
        if (spot.left !== undefined) {
            offsetX += spot.left;
            parent.scrollLeft = offsetX;
        }
    }

    if ((parent.tagName.toUpperCase()) === "BODY"
        && parent.scrollHeight === parent.clientHeight) {
        parent = document.getElementsByTagName("html")[0]
    }
    parent.scrollTop = offsetY;
}