/**
 * TempImageFactory
 * Create a temp canvas
 */
class TempImageFactory {
  static #tempCanvas: HTMLCanvasElement | null = null;

  static getCanvas(
    width: number,
    height: number
  ): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
    const tempCanvas = (this.#tempCanvas ||= document.createElement("canvas"));
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.style.width = `${Math.floor(width)}px`;
    tempCanvas.style.height = `${Math.floor(height)}px`;

    // Since this is a temporary canvas, we need to fill it with a white
    // background ourselves.
    const ctx = tempCanvas.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    return [tempCanvas, tempCanvas.getContext("2d")];
  }

  static destroyCanvas() {
    const tempCanvas = this.#tempCanvas;
    if (tempCanvas) {
      // Zeroing the width and height causes Firefox to release graphics
      // resources immediately, which can greatly reduce memory consumption.
      tempCanvas.width = 0;
      tempCanvas.height = 0;
    }
    this.#tempCanvas = null;
  }
}

export { TempImageFactory };
