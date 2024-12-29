const voidFn = () => void 0;

const T = () => true;
const F = () => false;

const toFunctionCreator =
    (Constructor) =>
    (...props) =>
        new Constructor(...props);

export { voidFn, T, F, toFunctionCreator };
