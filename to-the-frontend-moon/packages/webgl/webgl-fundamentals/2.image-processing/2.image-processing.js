import { createGlContext, createProgram, createShader, updateViewportFactory } from "../lib/utils.js";

const vertexShaderSource = `
    uniform vec2 u_resolution;
    uniform vec2 u_movement;
    uniform float u_zoom;
    attribute vec2 a_rect;
    attribute vec2 a_texture;
    varying vec2 v_texCoord;
    
    vec2 toClipSpace(vec2 source) {
        vec2 zeroToOne = source / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        return clipSpace * vec2(1, -1);
    }
    
    void main() {
        vec4 initialPos = vec4(a_rect, 0, 1);
        mat4 movement = mat4 (
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            u_movement.x / u_zoom, u_movement.y / u_zoom, 0, 1
        );
        mat4 zoom = mat4 (
            u_zoom, 0, 0, 0,
            0, u_zoom, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 1
        );
        vec4 final_pos = (zoom * movement) * initialPos;
        
        gl_Position = vec4(toClipSpace(vec2(final_pos.x, final_pos.y)), 0, 1);
        v_texCoord = a_texture;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

const loadImage = () =>
    new Promise((resolve) => {
        const image = new Image();
        image.src = new URL("karta.png", import.meta.url);
        image.onload = () => resolve(image);
    });

function setRectangle(gl, x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW,
    );
}

const context = {
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
};

const imageProcessing = async () => {
    const waitImage = loadImage();

    const { gl, canvasSizes, canvas } = createGlContext();

    const updateOffset = (e) => {
        context.offsetX += e.movementX;
        context.offsetY += e.movementY;
        console.log(e.movementX, e.movementY);
    };
    document.addEventListener("mousedown", () => {
        document.addEventListener("pointermove", updateOffset);
    });
    document.addEventListener("mouseup", () => {
        document.removeEventListener("pointermove", updateOffset);
    });
    document.addEventListener("wheel", (e) => {
        context.zoom += e.deltaY > 0 ? -0.05 : 0.05;
        const projectionX = e.clientX / canvasSizes.width;
        const projectionY = e.clientY / canvasSizes.height;
        const newWidth = canvasSizes.width * context.zoom;
        const newHeight = canvasSizes.height * context.zoom;
        context.offsetX *= projectionX;
        context.offsetY *= projectionY;
        console.log(projectionX, projectionY, canvasSizes.width, canvasSizes.height, newWidth, newHeight)
    })

    const updateViewport = updateViewportFactory(canvasSizes);
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const rectCoordinate = gl.getAttribLocation(program, "a_rect");
    const textureCoordinate = gl.getAttribLocation(program, "a_texture");
    const movement = gl.getUniformLocation(program, "u_movement");
    const zoom = gl.getUniformLocation(program, "u_zoom");
    const resolution = gl.getUniformLocation(program, "u_resolution");

    const rectCoordinateBuffer = gl.createBuffer();
    const textureCoordinateBuffer = gl.createBuffer();

    const image = await waitImage;
    context.imageWidth = image.width;
    context.imageHeight = image.height;
    gl.bindBuffer(gl.ARRAY_BUFFER, rectCoordinateBuffer);
    setRectangle(gl, 0, 0, image.width, image.height);
    gl.enableVertexAttribArray(rectCoordinate);
    gl.vertexAttribPointer(rectCoordinate, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
        gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(textureCoordinate);
    gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.useProgram(program);

    const drawScene = () => {
        updateViewport(gl);

        gl.uniform2f(resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(movement, context.offsetX, context.offsetY);
        gl.uniform1f(zoom, context.zoom);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(drawScene);
    };

    drawScene();
};

/* TODO
 *  1) Zoom происходит не туда, куда указываю мышью
 */

imageProcessing();
