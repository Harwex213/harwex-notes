// Взято из https://github.com/reduxjs/react-redux/blob/822f5c923b18d8b44c397b3ee16f2b46e70c4f95/src/utils/shallowEqual.ts

function is(x, y) {
    if (x === y) {
        // Хэндлит кейс `is(0, -0)`. Если сделать просто `0 === -0`, то вёрнется true (мы хотим чтобы это было не true).
        // Делаем это сравнивая между собой Infinity (1 / -0 === -Infinity) => (Infinity !== -Infinity)
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    } else {
        // Хэндлит кейс `is(NaN, NaN)`.
        return x !== x && y !== y
    }
}

// У объектов совпадают ключи и их значения по ссылке
function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true

    if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) return false

    for (let i = 0; i < keysA.length; i++) {
        if (
            !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false
        }
    }

    return true;
}

export { shallowEqual }