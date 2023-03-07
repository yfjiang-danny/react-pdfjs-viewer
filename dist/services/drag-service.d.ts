import { BasicTarget } from "../types/types";
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
/**
 * DragService
 *
 * @description
 * Usage:
 * 1. Define a new class to extends DragService
 * 2. Implement onDragging function with adding dragging logic
 * 3. Implement onDragend function to release sources
 *
 * @example
 * const service = useMemo(() => { return new CustomDragService({}); },[])
 * useEffect(() => {
 *    service.addDragSource({ element: el, parameter: {a:1}});
 *    return () => {
 *       service.addDragSource({ element: el, parameter: {a:1}});
 *    }
 * }, [])
 *
 */
declare class DragService<T> {
    protected dragSources: DragSource<T>[];
    protected dragFinishedFunctions: VoidFunction[];
    protected currentDragParams: DragSourceParameter<T> | undefined;
    dragging: boolean;
    protected mouseStartEvent: MouseEvent | null;
    protected getDocument: HTMLElement | (() => HTMLElement) | undefined;
    constructor(ops: DragServiceOptions);
    getContainer(): HTMLElement;
    addDragSource(params: DragSourceParameter<T>): void;
    removeDragSource(params: DragSourceParameter<T>): void;
    hasDragSource(source: DragSourceParameter<T>): boolean;
    destroy(): void;
    isDragging(): boolean;
    protected onMouseDown(params: DragSourceParameter<T>, event: MouseEvent): void;
    protected onMouseMove(event: MouseEvent, el: HTMLElement): void;
    protected onCancel(): void;
    protected onMouseUp(event: MouseEvent, el: HTMLElement): void;
    protected onDragging(event: MouseEvent, el: HTMLElement): void;
    protected onDraggingEnd(event: MouseEvent, el: HTMLElement): void;
    protected addTemporaryEvents(events: DragEvent[]): void;
}
export type { DragServiceOptions, DragSourceParameter };
export { DragService };
