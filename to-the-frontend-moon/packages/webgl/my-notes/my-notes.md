#### С чего начинается WebGL приложение?

1) Нужно создать контекст

```js
    const gl = canvas.getContext("webgl"); // canvas - инстанс <canvas> элемента
    if (!gl) {
        throw new Error("WebGL is not supported!");
    }
```

2) Создать GL программу

```js
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (isSuccess) {
        return program;
    }
```

- GL программа объединяет vertex & fragment шейдеры
- Прежде чем юзать программу, её следует привязать (`gl.linkProgram(program)`). Смысл этого действия якобы в том, что мы оптимизируем скомпилированные шейдеры для выполнения их на GPU, а также чекаем возможные ошибки в написании шейдеров (ведь мы пишем их в отрыве друг от друга, а varying-переменные как-то надо проверять).
- Для того, чтобы юзать программу, надо вызвать `gl.useProgram(program)`. Когда мы будем вызывать API для отрисовки наши байты полетят в эту программу (шейдеры, связанные с этой программой)

3) Написать шейдеры

```js
    const shader = gl.createShader(type); // gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    gl.shaderSource(shader, source); // source - строка (string) с исходным кодом на GLSL 
    gl.compileShader(shader);
    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (isSuccess) {
        return shader;
    }
```

4) 





















