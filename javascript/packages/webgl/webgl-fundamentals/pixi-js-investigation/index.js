import PIXI from "./pixi.js";

const { Application, Assets, Sprite, Point, EventSystem } = PIXI;

console.log(Application);

// Asynchronous IIFE
(async () => {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: "#1099bb", resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Load the bunny texture.
    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

    // Create a new Sprite from an image path.
    const bunny = new Sprite(texture);

    // Add to stage.
    app.stage.addChild(bunny);

    // Center the sprite's anchor point.
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen.
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    // Add an animation loop callback to the application's ticker.
    app.ticker.add((time) => {
        /**
         * Just for fun, let's rotate mr rabbit a little.
         * Time is a Ticker object which holds time related data.
         * Here we use deltaTime, which is the time elapsed between the frame callbacks
         * to create frame-independent transformation. Keeping the speed consistent.
         */
        bunny.x += 0.1 * time.deltaTime;
    });

    const eventSystem = new EventSystem(app.renderer);
    eventSystem.setTargetElement(app.canvas);

    document.body.addEventListener("click", (event) => {
        const point = new Point();
        eventSystem.mapPositionToPoint(point, event.clientX, event.clientY);
        const localPoint = bunny.toLocal(point);
        bunny.scale = bunny.scale.x + 0.1;
        const globalPoint = bunny.toGlobal(localPoint);
        bunny.x += point.x - globalPoint.x;
        bunny.y += point.y - globalPoint.y;
        console.log(point, localPoint, globalPoint);
    });
})();
