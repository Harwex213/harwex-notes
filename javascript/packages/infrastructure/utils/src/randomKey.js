const randomKey = () =>
    [...Array(12)].map(() => String.fromCharCode(Math.floor(Math.random() * 65535))).join("");

export { randomKey };
