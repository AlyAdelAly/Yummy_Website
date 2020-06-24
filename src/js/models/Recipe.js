import axios from 'axios';

export default class Recipe{
  constructor(id){
    this.id = id;
  }

  
async getRecipe(){
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  try {
    const res = await axios(`${proxy}https://recipesapi.herokuapp.com/api/get?rId=${this.id}`);
    this.title = res.data.recipe.title;
    this.publisher = res.data.recipe.publisher;
    this.img = res.data.recipe.image_url;
    this.url = res.data.recipe.source_url;
    this.ingredients = res.data.recipe.ingredients;
  } catch (error) {
        alert(error);
       }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15; 
    }

    calcServings() {
      this.servings = 4;
    }

    parseIngredients() {
      const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
      const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
      const units = [...unitsShort, 'kg', 'g'];

      const newIngredients = this.ingredients.map(el_1 => {
          // Uniform units
          let ingredient = el_1.toLowerCase();
          unitsLong.forEach((unit, i) => {
              ingredient = ingredient.replace(unit, unitsShort[i]);
          });

          // Remove parentheses
          ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

          // Parse ingredients into count, unit and ingredient
          const arrIng = ingredient.split(' ');
          const unitIndex = arrIng.findIndex(el_2 => units.includes(el_2));

          let objIng;
          if (unitIndex > -1) {
              // There is a unit
              const arrCount = arrIng.slice(0, unitIndex);
              
              let count;
              if (arrCount.length === 1) {
                  count = eval(arrIng[0].replace('-', '+'));
              } else {
                  count = eval(arrIng.slice(0, unitIndex).join('+'));
              }

              objIng = {
                  count: count,
                  unit: arrIng[unitIndex],
                  ingredient: arrIng.slice(unitIndex + 1).join(' ')
              };

          } else if (parseInt(arrIng[0], 10)) {
              // There is NO unit, but 1st element is number
              objIng = {
                  count: parseInt(arrIng[0], 10),
                  unit: '',
                  ingredient: arrIng.slice(1).join(' ')
              }
          } else if (unitIndex === -1) {
              // There is NO unit and NO number in 1st position
              objIng = {
                  count: 1,
                  unit: '',
                  ingredient: ingredient
              }
          }

          return objIng;
      });
      this.ingredients = newIngredients;
  }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingerdients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}


