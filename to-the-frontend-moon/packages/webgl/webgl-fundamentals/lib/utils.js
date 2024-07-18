export const observeResize = (() => {
    const subscribers = new WeakMap();
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            let width;
            let height;
            if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                } else {
                    // legacy
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            } else {
                // legacy
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            const displayWidth = Math.round(width);
            const displayHeight = Math.round(height);
            const notify = subscribers.get(entry.target);
            if (notify) {
                notify(displayWidth, displayHeight);
            }
        }
    });

    return (element, notify) => {
        subscribers.set(element, notify);
        resizeObserver.observe(element, { box: "content-box" });
        const boundingRect = element.getBoundingClientRect();
        notify(boundingRect.width, boundingRect.height);
    }
})();
