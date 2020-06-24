import {allElements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLoveButton = isLoved => {
    const iconString = isLoved ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLoveMenu = numLoves => {
    allElements.lovesMenu.style.visibility = numLoves > 0 ? 'visible' : 'hidden';
};

export const renderLove = love => {
    const markup = `
        <li>
            <a class="likes__link" href="#${love.id}">
                <figure class="likes__fig">
                    <img src="${love.img}" alt="${love.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(love.title)}</h4>
                    <p class="likes__author">${love.publisher}</p>
                </div>
            </a>
        </li>
    `;
    allElements.lovesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLove = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}