class Observable {
    #onSubscribe;

    constructor(onSubscribe) {
        this.#onSubscribe = onSubscribe;
    }

    subscribe(observer) {
        const subscription = new Observer(observer);
        const finalizer = this.#onSubscribe(subscription);
        subscription.add(finalizer);
        return subscription;
    }
}

class Observer {
    #finalizers;
    #destination;

    constructor(destination) {
        this.#destination = destination;
        this.#finalizers = [];
    }

    next(value) {
        this.#destination.next(value);
    }

    complete() {
        this.#destination.complete();
    }

    error(err) {
        this.#destination.error(err);
    }

    add(finalizer) {
        this.#finalizers.push(finalizer);
    }

    remove(finalizer) {
        this.#finalizers = this.#finalizers.filter((it) => finalizer !== it);
    }

    unsubscribe() {
        for (const finalizer of this.#finalizers) {
            finalizer();
        }
    }
}

export { Observable }