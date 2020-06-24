import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Loves from './models/Loves';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as lovesView from './views/lovesView';
import {allElements , renderLoader , clearLoader} from './views/base';

/*Global state of the project
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

/** 
 * Search Controller
 */
const controlSearch = async () => {
    // Get Query from view
    const query = searchView.getInput();

    if (query) {
      // New search object and add to state
      state.search = new Search(query);

      // Prepare UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(allElements.searchResult);

      try {
          // Search for recipes
          await state.search.getResults();

          // Output results on UI
          clearLoader();
          searchView.renderResults(state.search.result);
      } catch (err) {
          alert('Something wrong with the search..');
      }
    }
};

allElements.searchForm.addEventListener('submit' , e => {
    e.preventDefault();
    controlSearch();
});

allElements.searchResultPages.addEventListener('click' , e => {
    const Btn = e.target.closest('.btn-inline');
    if (Btn) {
        const goToPage = parseInt(Btn.dataset.goto , 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result , goToPage);
    }
});


/** 
 * Recipe Controller
 */
const controlRecipe = async () => {
    // Get id from url
    const id = window.location.hash.replace('#' , '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(allElements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlitSelectedItem(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        
        try {
            // Get data of recipe and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe , state.loves.isLoved(id));

        } catch (err) {
            alert('Error processing recipe!');
        }    
    }
};
['hashchange' , 'load'].forEach(event => window.addEventListener(event , controlRecipe));


/** 
 * List Controller
 */
const controlList = () => {
    // Create new list
    if(!state.list) state.list = new List();

    // Add each ingredient to the UI and list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count , el.unit , el.ingredient);
        listView.renderItem(item);
    });
};


/** 
 * Love Controller
 */
const controlLove = () => {
    if(!state.loves) state.loves = new Loves();
    const currentId = state.recipe.id;

    if(!state.loves.isLoved(currentId)) {
        //Add love to the state
        const newLove = state.loves.addLove(currentId , state.recipe.title , state.recipe.publisher , state.recipe.img);

        // Toggle the love button
        lovesView.toggleLoveButton(true);

        // Add love to UI list
        lovesView.renderLove(newLove);

    } else {
        // Remove love from the state 
        state.loves.removeLove(currentId);

        // Toggle the love button
        lovesView.toggleLoveButton(false);

        // Remove love from UI list
        lovesView.deleteLove(currentId);
    }
    lovesView.toggleLoveMenu(state.loves.getNumLoves());
};

// Restore loved recipes on page load
window.addEventListener('load' , () => {
    state.loves = new Loves();
    
    // Restore Loves
    state.loves.readStorage();

    // Toggle love menu btn
    lovesView.toggleLoveMenu(state.loves.getNumLoves());

    // Render existing loves
    state.loves.loves.forEach(lo => lovesView.renderLove(lo));
});

// Delete and update list item events
allElements.shoppingList.addEventListener('click' , e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the list
        state.list.removeItem(id);

        // Delete from UI
        listView.removeItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Handling recipe button clicks
allElements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsAndIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsAndIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLove();
    }
});

