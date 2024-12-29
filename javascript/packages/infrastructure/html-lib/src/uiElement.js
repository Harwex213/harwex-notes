import { randomKey } from "@hw/utils";
import { RESERVED_PROPS } from "./constants.js";

const attachProps = (htmlElement, props) => {
    const eventListenerFinalizers = [];
    for (const [key, value] of Object.entries(props)) {
        if (RESERVED_PROPS.includes(key)) {
            continue;
        }
        if (key[0] === "o" && key[1] === "n") {
            let name = "";
            if (key.toLowerCase() in htmlElement || key === "onFocusOut" || key === "onFocusIn") {
                name = key.toLowerCase().slice(2);
            } else {
                name = key.slice(2);
            }

            htmlElement.addEventListener(name, value);
            eventListenerFinalizers.push(() => htmlElement.removeEventListener(name, value));
        } else {
            htmlElement.setAttribute(key, value);
        }
    }
    return eventListenerFinalizers;
};

class UiElement {
    key;
    htmlElement;
    finalizers = [];
    #children = [];

    constructor(htmlElement, props = {}) {
        this.htmlElement = htmlElement;
        this.key = props.key ?? randomKey();

        const eventListenerFinalizers = attachProps(this.htmlElement, props);
        for (const finalizer of eventListenerFinalizers) {
            this.addFinalizer(finalizer);
        }
    }

    #clearChildren() {
        for (const child of this.#children) {
            child.destroy();
        }
        this.#children = [];

        this.htmlElement.replaceChildren();
    }

    addFinalizer(finalizer) {
        this.finalizers.push(finalizer);
    }

    finalize() {
        for (const finalizer of this.finalizers) {
            finalizer();
        }
    }

    destroy() {
        for (const child of this.#children) {
            child.destroy();
        }
        this.finalize();

        this.htmlElement.remove();
    }

    children(uiElements) {
        if (!uiElements || uiElements.length === 0) {
            this.#clearChildren();
            return this;
        }

        let uiElementIndex = 0;
        for (let i = 0; i < this.#children.length; i++) {
            const previous = this.#children[i];
            const current = uiElements[i];

            if (!current) {
                previous.destroy();
                break;
            }
            if (previous.key !== current.key) {
                previous.destroy();
                previous.htmlElement.replaceWith(current.htmlElement);
            }

            uiElementIndex = i;
        }
        for (; uiElementIndex < uiElements.length; uiElementIndex++) {
            const current = uiElements[uiElementIndex];
            this.htmlElement.append(current.htmlElement);
        }

        this.#children = uiElements;

        return this;
    }

    child(uiElement) {
        return this.children([uiElement]);
    }

    content(text) {
        return this.child(new UiElement(new Text(text)));
    }
}

export { UiElement };
