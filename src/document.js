const q = document.querySelector;

export const setInnerText = (query, text) => {
    q(query).innerText = text;
}

export const setStyle = (query, property, value) => {
    q(query).style[property] = value;
};