import {
  DragService,
  DragServiceOptions,
  DragSourceParameter,
} from "../services/drag-service";
import { SIDEBAR_MAX_PERCENT, SIDEBAR_MIN } from "../types/constant";

interface SidebarResizerOptions extends DragServiceOptions {}

class SidebarResizer<T> extends DragService<T> {
  sidebarWidth = 0;
  constructor(ops: SidebarResizerOptions) {
    super(ops);
  }

  protected onMouseDown(
    params: DragSourceParameter<T>,
    event: MouseEvent
  ): void {
    super.onMouseDown(params, event);
    const sidebar = document.getElementById("__sidebar__");

    if (sidebar) {
      this.sidebarWidth = sidebar.offsetWidth;
    }
  }

  protected onDragging(event: MouseEvent, el: HTMLElement): void {
    if (this.mouseStartEvent) {
      const offsetX = event.pageX - this.mouseStartEvent.pageX;

      const wd = Math.max(
        Math.min(
          this.sidebarWidth + offsetX,
          SIDEBAR_MAX_PERCENT * this.getContainer().clientWidth
        ),
        SIDEBAR_MIN
      );

      const htmlEl = document.getElementsByTagName("html")[0];

      htmlEl.style.setProperty("--sidebar-width", wd + "px");
    }
  }
}

export { SidebarResizer, type SidebarResizerOptions };
