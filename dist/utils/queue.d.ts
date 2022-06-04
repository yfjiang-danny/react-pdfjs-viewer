declare class RenderQueue<T> {
    private queue;
    size(): number;
    push(a: T): void;
    pop(): T | undefined;
}
export { RenderQueue };
