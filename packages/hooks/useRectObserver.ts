import { useEffect, useRef, useState } from "react"

interface RectObserverProps {
    elRef: React.MutableRefObject<HTMLElement | null>;
}

function useRectObserver({ elRef }: RectObserverProps) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0)
    const observer = useRef<ResizeObserver | null>(null);


    function resizeObserver(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            setWidth(width);
            setHeight(height);
        }
    }

    useEffect(() => {
        if (elRef.current) {
            observer.current = new ResizeObserver(resizeObserver);

            observer.current.observe(elRef.current);
        }
        return () => {
            if (elRef.current && observer.current) {
                observer.current.unobserve(elRef.current);
                observer.current.disconnect();
            }
        }
    }, [])

    return {
        height,
        width
    }
}

export { useRectObserver }