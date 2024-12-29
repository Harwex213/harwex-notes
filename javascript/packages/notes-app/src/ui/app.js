import { div } from "@hw/html-lib";

const renderUI = (htmlElement) => {
    const container = div();

    htmlElement.appendChild(container.htmlElement);
};

export { renderUI };
