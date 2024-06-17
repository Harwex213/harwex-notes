import test from "node:test";
import assert from "node:assert";
import { Subject, map } from "rxjs"

test("Subject should have multiple subscribers", (t, done) => {
    const subject = new Subject();

    const emitted = 1;

    for (let i = 0; i < 3; i++) {
        subject.subscribe((value) => {
            assert.strictEqual(value, emitted);
        })
    }

    subject.subscribe({ complete: done });

    subject.next(emitted);
    subject.complete();
});

test("Subject should can be piped", (t, done) => {
    const subject = new Subject();
    const piped = subject.pipe(
        map((value) => {
            console.log("subject.pipe.map");
            return value * 2;
        })
    )

    const emitted = 1;

    for (let i = 0; i < 3; i++) {
        console.log("piped.subscribe");
        piped.subscribe((value) => {
            assert.strictEqual(value, emitted * 2);
        })
    }

    piped.subscribe({ complete: done });

    console.log("piped.next");
    piped.next(emitted);
    console.log("piped.complete");
    piped.complete();
});