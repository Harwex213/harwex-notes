import test from "node:test";
import assert from "node:assert";
import {Subject, map, concat, interval, takeWhile, merge} from "rxjs"

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

test("Concat should process observables sequentially", (t, done) => {
    const source$1 = interval(10).pipe(takeWhile(value => value < 3));
    const source$2 = interval(5).pipe(map(value => value + 5), takeWhile(value => value < 8));
    const result = concat(
        source$1,
        source$2,
    );

    const expected = [0, 1, 2, 5, 6, 7];
    const actual = [];
    result.subscribe({
        next: (value) => {
            actual.push(value);
            console.log("currentValue", value);
        },
        complete: () => {
            assert.deepStrictEqual(expected, actual);
            done();
        }
    });
});

test("Merge should process observables concurrently", (t, done) => {
    const source$1 = interval(30).pipe(takeWhile(value => value < 3));
    const source$2 = interval(5).pipe(map(value => value + 5), takeWhile(value => value < 8));
    const result = merge(
        source$1,
        source$2,
    );

    const expected = [5, 6, 7, 0, 1, 2];
    const actual = [];
    result.subscribe({
        next: (value) => {
            actual.push(value);
            console.log("currentValue", value);
        },
        complete: () => {
            assert.deepStrictEqual(expected, actual);
            done();
        }
    });
});
