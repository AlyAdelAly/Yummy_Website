import {allElements} from './base';

export const getInput = () => allElements.serachInput.value;

export const clearInput = () => {
    allElements.serachInput.value = '';
};

export const clearResults = () => {
  allElements.searchResultList.innerHTML = '';
  allElements.searchResultPages.innerHTML = '';
};

export const highlitSelectedItem = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach (el => {
      el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title , limit = 17) => {
    const newTitle =[];
    if (title.length > limit) {
        title.split(' ').reduce((acc , cur) => {
          if (acc + cur.length <= limit) {
              newTitle.push(cur);
          }
          return acc + cur.length;
        } , 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

export const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    allElements.searchResultList.insertAdjacentHTML('beforeend' , markup);
};

// type => (pev or next)
const createButton = (page , type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page , numOfResults , resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);

    let button;
    if(page === 1 && pages > 1) {
      // Only one button to go to the next page
      button = createButton(page , 'next');
    } else if (page < pages) {
      // Both buttons (prev and next)
      button = `
          ${createButton(page , 'prev')}
          ${createButton(page , 'next')}`
      ;
    } else if (page === pages && pages > 1) {
      // Only one button to go to the previous page
      button = createButton(page , 'prev'); 
    }

    allElements.searchResultPages.insertAdjacentHTML('afterbegin' , button);
};

export const renderResults = (recipes , page = 1 , resPerPage = 10) => {
  // Render results of current page
    const begin = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(begin , end).forEach(renderRecipe);

    // Render pagination buttons
    renderButtons(page , recipes.length , resPerPage);
};