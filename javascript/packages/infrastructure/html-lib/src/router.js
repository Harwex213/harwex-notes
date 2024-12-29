import { action, makeObservable, observable } from "mobx";

class Router {
    currentPath = window.location.pathname;

    constructor() {
        makeObservable(this, {
            currentPath: observable,
            goTo: action,
        });
    }

    goTo(url) {
        if (window.location === url) {
            return;
        }

        try {
            window.history.pushState(null, "", url);
            this.currentPath = url;
        } catch (error) {
            if (error instanceof DOMException && error.name === "DataCloneError") {
                throw error;
            }
            window.location.assign(url);
        }
    }
}

const router = new Router();

export { router };
