declare class TempImageFactory {
    #private;
    static getCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D | null];
    static destroyCanvas(): void;
}
export { TempImageFactory };
