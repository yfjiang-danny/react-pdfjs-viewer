/// <reference types="react" />
interface RectObserverProps {
    elRef: React.MutableRefObject<HTMLElement | null>;
}
declare function useRectObserver({ elRef }: RectObserverProps): {
    height: number;
    width: number;
};
export { useRectObserver };
