
import React from "react";

export const useDebouncedCallback = (
    callback: (...args: any[]) => void,
    delay: number
) => {
    const timer = React.useRef<number | undefined>();

    const debouncedCallback = React.useCallback(
        (...args: any[]) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = window.setTimeout(() => {
                callback(...args);
                timer.current = undefined;
            }, delay);
        },
        [callback, delay]
    );

    return debouncedCallback;
};