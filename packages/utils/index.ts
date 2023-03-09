/**
 * Check if element is in viewport
 * @param el
 * @returns
 */
function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top > 0 &&
    rect.top + rect.height / 2 < document.documentElement.clientHeight
  );
}

/**
 * Scrolls specified element into view of its parent by element id.
 * @param id
 */
function scrollIntoViewByID(id: string) {
  const el = document.getElementById(id);

  if (el) {
    if (isInViewport(el)) {
      return;
    }
    scrollIntoView(el);
  }
}

/**
 * Scrolls specified element into view of its parent.
 * @param {Object} element - The element to be visible.
 * @param {Object} spot - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {boolean} [scrollMatches] - When scrolling search results into view,
 *   ignore elements that either: Contains marked content identifiers,
 *   or have the CSS-rule `overflow: hidden;` set. The default value is `false`.
 */
function scrollIntoView(
  element: HTMLElement,
  spot: { top?: number; left?: number } = { top: 0, left: 0 },
  scrollMatches = false
) {
  // Assuming offsetParent is available (it's not available when viewer is in
  // hidden iframe or object). We have to scroll: if the offsetParent is not set
  // producing the error. See also animationStarted.
  let parent = element.offsetParent as HTMLElement;
  if (!parent) {
    console.error("offsetParent is not set -- cannot scroll");
    return;
  }
  let offsetY = element.offsetTop + element.clientTop;
  let offsetX = element.offsetLeft + element.clientLeft;
  while (
    (parent.clientHeight === parent.scrollHeight &&
      parent.clientWidth === parent.scrollWidth) ||
    (scrollMatches &&
      (parent.classList.contains("markedContent") ||
        getComputedStyle(parent).overflow === "hidden"))
  ) {
    offsetY += parent.offsetTop;
    offsetX += parent.offsetLeft;

    parent = parent.offsetParent as HTMLElement;
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
  parent.scrollTop = offsetY;
}

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
function watchScroll(
  viewAreaElement: HTMLElement,
  callback: (st: ScrollState) => void
) {
  const debounceScroll = function (evt: Event) {
    if (rAF) {
      return;
    }
    // schedule an invocation of scroll for next animation frame.
    rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
      rAF = null;

      const currentX = viewAreaElement.scrollLeft;
      const lastX = state.lastX;
      if (currentX !== lastX) {
        state.right = currentX > lastX;
      }
      state.lastX = currentX;
      const currentY = viewAreaElement.scrollTop;
      const lastY = state.lastY;
      if (currentY !== lastY) {
        state.down = currentY > lastY;
      }
      state.lastY = currentY;
      callback(state);
    });
  };

  const state: ScrollState = {
    right: true,
    down: true,
    lastX: viewAreaElement.scrollLeft,
    lastY: viewAreaElement.scrollTop,
    _eventHandler: debounceScroll,
    remove: () => {
      viewAreaElement.removeEventListener("scroll", debounceScroll, true);
    },
  };

  let rAF: number | null = null;
  viewAreaElement.addEventListener("scroll", debounceScroll, true);
  return state;
}

/**
 *  Approximates float number as a fraction using Farey sequence (max order
 *  of 8).
 *  @param {number} x - Positive float number.
 *  @returns {Array} Estimated fraction: the first array item is a numerator,
 *                   the second one is a denominator.
 */
function approximateFraction(x: number) {
  // Fast paths for int numbers or their inversions.
  if (Math.floor(x) === x) {
    return [x, 1];
  }
  const xinv = 1 / x;
  const limit = 8;
  if (xinv > limit) {
    return [1, limit];
  } else if (Math.floor(xinv) === xinv) {
    return [1, xinv];
  }

  const x_ = x > 1 ? xinv : x;
  // a/b and c/d are neighbours in Farey sequence.
  let a = 0,
    b = 1,
    c = 1,
    d = 1;
  // Limiting search to order 8.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Generating next term in sequence (order of q).
    const p = a + c,
      q = b + d;
    if (q > limit) {
      break;
    }
    if (x_ <= p / q) {
      c = p;
      d = q;
    } else {
      a = p;
      b = q;
    }
  }
  let result;
  // Select closest of the neighbours to x.
  if (x_ - a / b < c / d - x_) {
    result = x_ === x ? [a, b] : [b, a];
  } else {
    result = x_ === x ? [c, d] : [d, c];
  }
  return result;
}

/**
 * 获取不小于 x 并且能够被 div 整除的最大整数
 * @param x
 * @param div
 * @returns
 */
function roundToDivide(x: number, div: number) {
  const r = x % div;
  return r === 0 ? x : Math.round(x - r + div);
}

function scrollToPageIndex(index: number) {
  const scrollEl = document.getElementById("__pdf_viewer_container__");
  if (scrollEl) {
    const el = document.getElementById(`__page_${index}__`);

    el &&
      scrollEl.scrollTo({
        top: el.offsetTop,
      });
  }
}

export {
  roundToDivide,
  approximateFraction,
  watchScroll,
  scrollIntoView,
  scrollIntoViewByID,
  ScrollState,
  scrollToPageIndex,
};
