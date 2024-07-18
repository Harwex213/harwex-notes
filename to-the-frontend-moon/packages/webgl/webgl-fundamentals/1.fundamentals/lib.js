import { observeResize } from "../lib/utils.js";

export const createShader = (gl, type, source) => {
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

export const createProgram = (gl, vertexShader, fragmentShader) => {
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

export const createGlContext = () => {
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
