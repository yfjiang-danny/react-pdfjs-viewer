class RenderQueue<T> {
  private queue: T[] = [];

  size() {
    return this.queue.length;
  }

  push(a: T) {
    this.queue.push(a);
  }

  pop() {
    return this.queue.pop();
  }
}

export { RenderQueue };
