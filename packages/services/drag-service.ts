import { BasicTarget, getTargetElement } from "../types/types";

interface DragServiceOptions {
  getDocument?: HTMLElement | (() => HTMLElement);
}

interface DragEvent {
  target: HTMLElement;
  type: "mousemove" | "mouseup" | "mouseleave";
  listener: (ev: MouseEvent) => void;
  options?: EventListenerOptions;
}

interface DragSourceParameter<T> {
  element: BasicTarget<HTMLElement>;
  parameter?: T;
}

interface DragSource<T> extends DragSourceParameter<T> {
  mouseDownListener: (ev: MouseEvent, el: HTMLElement) => void;
}

// NEXT: Impl touch/pointer event.
/**
 * DragService
 *
 *
 */
class DragService<T> {
  // Drag sources
  protected dragSources: DragSource<T>[] = [];
  // Cancel or finished
  protected dragFinishedFunctions: VoidFunction[] = [];
  // Drag source params, set at the moment adding drag source.
  protected currentDragParams: DragSourceParameter<T> | undefined = undefined;
  dragging = false;
  protected mouseStartEvent: MouseEvent | null = null;
  // Move event listener target
  protected getDocument: HTMLElement | (() => HTMLElement) | undefined =
    undefined;

  constructor(ops: DragServiceOptions) {
    this.getDocument = ops.getDocument;
    if (process.env.NODE_ENV == "development") {
      console.log("Create DragService");
    }
  }

  addDragSource(params: DragSourceParameter<T>): void {
    const el = getTargetElement(params.element);
    if (el) {
      const mouseDownListener = this.onMouseDown.bind(this, params);
      el.addEventListener("mousedown", mouseDownListener);
      this.dragSources.push({
        ...params,
        mouseDownListener: mouseDownListener,
      });
    }
  }

  removeDragSource(params: DragSourceParameter<T>): void {
    const findIndex = this.dragSources.findIndex((d) => {
      return d.element === params.element;
    });
    if (findIndex != -1) {
      const dragSource = this.dragSources[findIndex];

      const el = getTargetElement(dragSource.element);
      if (el) {
        el.removeEventListener(
          "mousedown",
          dragSource.mouseDownListener as unknown as EventListener
        );
        this.dragSources.splice(findIndex, 1);
      }
    }
  }

  hasDragSource(source: DragSourceParameter<T>): boolean {
    return !!this.dragSources.find((v) => v.element === source.element);
  }

  destroy(): void {
    const dragSource = this.dragSources.pop();
    const el = getTargetElement(dragSource?.element);
    if (dragSource && el) {
      el.removeEventListener(
        "mousedown",
        dragSource.mouseDownListener as unknown as EventListener
      );
    }
  }

  isDragging(): boolean {
    return this.dragging;
  }

  protected onMouseDown(
    params: DragSourceParameter<T>,
    event: MouseEvent
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const ev = event;

    if (this.dragging) {
      return;
    }

    // only interested in left button clicks
    if (ev.button !== 0) {
      return;
    }

    this.currentDragParams = params;
    this.dragging = false;
    this.mouseStartEvent = ev;

    const doc =
      typeof this.getDocument == "function"
        ? this.getDocument()
        : this.getDocument
        ? this.getDocument
        : document.body;

    const mouseMoveEvent = function (event: MouseEvent) {
      const el = getTargetElement(params.element);
      if (el) {
        return _this.onMouseMove(event, el);
      }
    };

    const mouseUpEvent = function (event: MouseEvent) {
      const el = getTargetElement(params.element);
      if (el) {
        return _this.onMouseUp(event, el);
      }
    };

    const target = doc;
    const events: DragEvent[] = [
      { target: target, type: "mousemove", listener: mouseMoveEvent },
      { target: target, type: "mouseup", listener: mouseUpEvent },
    ];
    // temporally add these listeners, for the duration of the drag
    this.addTemporaryEvents(events);

    doc.style.userSelect = "none";
  }

  protected onMouseMove(event: MouseEvent, el: HTMLElement): void {
    this.dragging = true;
    this.onDragging(event, el);
  }

  protected onCancel(): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.mouseStartEvent = null;
    while (this.dragFinishedFunctions.length > 0) {
      this.dragFinishedFunctions.pop()?.();
    }

    const doc =
      typeof this.getDocument == "function"
        ? this.getDocument()
        : this.getDocument
        ? this.getDocument
        : document.body;
    doc.style.userSelect = "initial";
  }

  protected onMouseUp(event: MouseEvent, el: HTMLElement): void {
    if (this.dragging) {
      this.onDraggingEnd(event, el);
      this.dragging = false;
    }
    this.mouseStartEvent = null;
    while (this.dragFinishedFunctions.length > 0) {
      this.dragFinishedFunctions.pop()?.();
    }

    const doc =
      typeof this.getDocument == "function"
        ? this.getDocument()
        : this.getDocument
        ? this.getDocument
        : document.body;
    doc.style.userSelect = "initial";
  }

  protected onDragging(event: MouseEvent, el: HTMLElement): void {
    // Deal with dragging logic
  }

  protected onDraggingEnd(event: MouseEvent, el: HTMLElement): void {
    // Deal with dragging logic when dragging end.
  }

  protected addTemporaryEvents(events: DragEvent[]): void {
    events.forEach(function (currentEvent) {
      const target = currentEvent.target,
        type = currentEvent.type,
        listener = currentEvent.listener,
        options = currentEvent.options;
      target.addEventListener(type, listener, options);
    });
    this.dragFinishedFunctions.push(function () {
      events.forEach(function (currentEvent) {
        const target = currentEvent.target,
          type = currentEvent.type,
          listener = currentEvent.listener,
          options = currentEvent.options;
        target.removeEventListener(type, listener, options);
      });
    });
  }
}

export type { DragServiceOptions, DragSourceParameter };
export { DragService };
