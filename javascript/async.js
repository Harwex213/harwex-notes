/**
 * Демонстрируем разницу между promiseFunc(), await promiseFunc(), return promiseFunc() и return await promiseFunc()
 */
async function foo() {
  const tossCoin = Boolean(Math.round(Math.random()));
  async function waitAndMaybeReject() {
    await new Promise((r) => setTimeout(r, 1000));

    if (tossCoin()) {
      return "yay";
    }

    throw Error("Boo!");
  }

  try {
    // Вызовим данную функцию и исполним её до "затыка", но дожидаться завершения не станем
    waitAndMaybeReject();

    // Подождём завершения промиса, попадём в catch на реджекте
    await waitAndMaybeReject();

    if (tossCoin()) {
      // Просто вернём промис, но если он реджектнется, то в catch в этой функции мы никогда не попадём
      return waitAndMaybeReject();
    } else {
      // Дождёмся резолва промиса и попадём в catch на реджект
      return await waitAndMaybeReject();
    }
  } catch (e) {
    return "caught";
  }
}
