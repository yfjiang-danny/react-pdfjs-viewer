import { DragService, DragServiceOptions, DragSourceParameter } from "../services/drag-service";
interface SidebarResizerOptions extends DragServiceOptions {
}
declare class SidebarResizer<T> extends DragService<T> {
    sidebarWidth: number;
    constructor(ops: SidebarResizerOptions);
    protected onMouseDown(params: DragSourceParameter<T>, event: MouseEvent): void;
    protected onDragging(event: MouseEvent, el: HTMLElement): void;
}
export { SidebarResizer, type SidebarResizerOptions };
