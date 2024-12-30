import { autorun } from "mobx";
import { toFunctionCreator, voidFn } from "@hw/utils";
import { router } from "./router.js";
import { UiElement } from "./uiElement.js";

const handleAnchorClickFabric =
    (onClick = voidFn) =>
    (e) => {
        e.preventDefault();
        router.goTo(e.target.getAttribute("href"));
        onClick(e);
    };

const elementFabric =
    (tagName) =>
    (props = {}) =>
        new UiElement(document.createElement(tagName), props);

const div = elementFabric("div");
const p = elementFabric("p");
const h1 = elementFabric("h1");
const h2 = elementFabric("h2");
const h3 = elementFabric("h3");
const h4 = elementFabric("h4");
const h5 = elementFabric("h5");
const h6 = elementFabric("h6");
const canvas = elementFabric("canvas");
const a = elementFabric("a");
const link = (props = {}) => a({ ...props, onClick: handleAnchorClickFabric(props.onClick) });

class Switcher {
    #routes = new WeakMap();
    #defaultPath = null;
    #uiElementContainer = null;

    constructor(uiElement) {
        if (!uiElement) {
            throw new Error("Switcher should be created with uiElement container, but received falsy value");
        }
        this.#uiElementContainer = uiElement;
    }

    match(route, handle) {
        this.#routes.set(route, handle);
        return this;
    }

    defaultPath(path) {
        this.#defaultPath = path;
        return this;
    }

    listen() {
        const finalize = autorun(() => {
            const currentPath = router.currentPath;

            for (const [route, handle] of this.#routes.entries()) {
                const match = route.matchRoute(currentPath);
                if (!!match) {
                    this.#uiElementContainer.child(handle(match.params));
                    break;
                }
            }

            if (this.#defaultPath) {
                router.goTo(this.#defaultPath);
            }
        });

        this.#uiElementContainer.addFinalizer(() => {
            finalize();
            this.#routes.clear();
        });
    }
}

const switcher = toFunctionCreator(Switcher);

export { div, h1, h2, h3, h4, h5, h6, a, link, p, canvas, switcher };
