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
const a = elementFabric("a");
const link = (props = {}) => a({ ...props, onClick: handleAnchorClickFabric(props.onClick) });
const p = elementFabric("p");
const canvas = elementFabric("canvas");

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

    match(route, component) {
        this.#routes.set(route, component);
        return this;
    }

    default(path) {
        this.#defaultPath = path;
        return this;
    }

    listen() {
        const finalize = autorun(() => {
            const currentPath = router.currentPath;

            for (const [route, component] of this.#routes.entries()) {
                if (!!route.matchRoute(currentPath)) {
                    this.#uiElementContainer.child(component());
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

export { div, a, link, p, canvas, switcher };
