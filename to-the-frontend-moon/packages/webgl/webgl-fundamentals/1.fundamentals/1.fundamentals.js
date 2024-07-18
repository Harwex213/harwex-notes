import { observeResize } from "../lib/utils.js";

const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (isSuccess) {
        return shader;
    }

    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (isSuccess) {
        return program;
    }

    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log);
};

const createGlContext = () => {
    const canvas = document.querySelector("#canvas");
    const canvasSizes = {
        width: 0,
        height: 0,
    }
    observeResize(canvas, (width, height) => {
        canvasSizes.width = width;
        canvasSizes.height = height;
    });
    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("We don't have webgl Context!");
    }
    return { gl, canvasSizes };
};

const vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    
    void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
    
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec4 u_color;
    
    void main() {
        gl_FragColor = u_color;
    }
`;

const { gl, canvasSizes } = createGlContext();
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

const a_position = gl.getAttribLocation(program, "a_position");
const u_resolution = gl.getUniformLocation(program, "u_resolution");
const u_color = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = new Float32Array([
    10, 20, 80, 20,
    10, 30, 10, 30,
    80, 20, 80, 30
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const updateViewportIfNecessary = (gl) => {
    const oldWidth = gl.canvas.width;
    const oldHeight = gl.canvas.height;
    const newWidth = canvasSizes.width;
    const newHeight = canvasSizes.height;
    const needResize = newWidth !== oldWidth || newHeight !== oldHeight;

    if (needResize) {
        gl.canvas.width  = newWidth;
        gl.canvas.height = newHeight;
        gl.viewport(0, 0, newWidth, newHeight);
    }
}

const drawScene = () => {
    updateViewportIfNecessary(gl);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(u_color, Math.random(), Math.random(), Math.random(), 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

drawScene();
