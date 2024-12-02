import puppeteer from "puppeteer";
import { join, resolve } from "node:path";
import { access, constants, mkdir, writeFile } from "node:fs/promises";

const OUTPUT_FOLDER_URL = resolve("..", "output");
const OUTPUT_URL = join(OUTPUT_FOLDER_URL, "data.json");

const createDirIfNecessary = async (url) => {
    try {
        await access("/etc/passwd", constants.F_OK);
    } catch {
        await mkdir(url);
    }
};

/**
 * 1) Добавить '--remote-debugging-port=9222' в конце ярлыка
 * 2) Дальше в хроме вводим http://127.0.0.1:9222/json/version
 * 3) Там будет URI на WS конекшн с айдишником (кстати это же можно автоматизировать...)
 */
const PUPPETEER_WS_URI = "ws://127.0.0.1:9222/devtools/browser/a3e1f369-0de9-4cca-ba11-48303833b357";
const PAGE_URI = "https://vk.com/sixieme_terre";
const LAST_POST_ID = "-117136234_23524";

const SELECTORS = {
    POST_LIST: "#page_wall_posts",
    POST: ".post",
    POST_TEXT: ".wall_post_text",
    POST_SHOW_MORE: ".PostTextMore",
    POST_PHOTO: ".PhotoPrimaryAttachment__imageElement",
};

const LOCATOR_FUNCTIONS = {
    POST: (index) => `#page_wall_posts .post:nth-of-type(${index + 1})`,
};

const uniqueId = () => Math.random().toString(16).slice(2, 18);

const createPostInfo = (text, imageUris) => ({
    id: uniqueId(),
    text,
    imageUris,
});

(async () => {
    const browser = await puppeteer.connect({ browserWSEndpoint: PUPPETEER_WS_URI });

    const page = await browser.newPage();

    await page.goto(PAGE_URI);
    await page.setViewport({ width: 1536, height: 733 });

    const postList = await page.waitForSelector(SELECTORS.POST_LIST);

    const getPostsLength = () => postList.$$eval(SELECTORS.POST, (elements) => elements.length);

    const postsInfo = [];

    let currentIndex = 0;
    console.log(await getPostsLength());
    while ((await getPostsLength()) !== currentIndex + 1) {
        const postLocator = await page.locator(LOCATOR_FUNCTIONS.POST(currentIndex));
        await postLocator.scroll();

        const postId = await postLocator.map((el) => el.dataset.postId).wait();
        if (postId === LAST_POST_ID) {
            break;
        }

        const post = await postLocator.waitHandle();
        const showMoreButton = await post.$(SELECTORS.POST_SHOW_MORE);
        if (showMoreButton) {
            await showMoreButton.scrollIntoView();
            await showMoreButton.click();
        }

        const postPhotos = await post.$$eval(SELECTORS.POST_PHOTO, (elements) =>
            elements.map((el) => el.src),
        );
        const postText = await post.$eval(SELECTORS.POST_TEXT, (el) => el.innerText);

        postsInfo.push(createPostInfo(postText, postPhotos));

        currentIndex++;
    }

    /*
     Мы можем прокрутить все посты ленты до нужного нам поста, а дальше
     фетчнуть все посты и соскрапить данные.

     Впоследствии мне нужно будет крутить только до нужного мне поста.

     Также следует сохранять настоящие id постов, мб пригодятся.

     Также возможно следует всё таки сохранять по посту. Так мы сможем жрать меньше памяти
     */

    await page.close();

    await createDirIfNecessary(OUTPUT_FOLDER_URL);
    await writeFile(OUTPUT_URL, JSON.stringify(postsInfo));
})();
