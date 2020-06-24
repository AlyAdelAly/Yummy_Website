export const allElements = {
  searchForm: document.querySelector('.search'),
  searchResult: document.querySelector('.results'),
  serachInput: document.querySelector('.search__field'),
  searchResultList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list'),
  lovesMenu: document.querySelector('.likes__field'),
  lovesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class = "${elementStrings.loader}">
          <svg>
              <use href = "img/icons.svg#icon-cw"></use>
          </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin' , loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
      loader.parentElement.removeChild(loader);
    }
};