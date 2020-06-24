export default class Loves {
  constructor() {
    this.loves = [];
  }

  addLove(id , title , publisher , img) {
    const love = { id , title , publisher , img};

    this.loves.push(love);

    this.presistData();

    return love;
  }

  removeLove(id) {
    const index = this.loves.findIndex(el => el.id === id);
    this.loves.splice(index , 1);

    this.presistData();
  }

  isLoved(id) {
    return this.loves.findIndex(el => el.id === id) !== -1;
  }

  getNumLoves() {
    return this.loves.length;
  }

  presistData() {
    localStorage.setItem('loves' , JSON.stringify(this.loves));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('loves'));

    if (storage) this.loves = storage;
  }

}