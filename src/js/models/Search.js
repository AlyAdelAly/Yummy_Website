import axios from 'axios';

export default class Search{
  constructor(query){
    this.query = query;
  }

  
async getResults(query){
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  try {
    const res = await axios(`${proxy}https://recipesapi.herokuapp.com/api/search?q=${this.query}`);
    this.result = res.data.recipes;
  } catch (error) {
        alert(error);
       }
    }
}