const userInput = document.querySelector('.userInput');
const productList = document.querySelector('.productList');
let itemsCounter = 0;

const createNewItem = (product) => {
    const newItem = document.createElement('li');
    newItem.innerHTML = product;
    newItem.dataset.item = itemsCounter;
    productList.appendChild(newItem);
    addItemsFeatures(newItem);
}


const addItemsFeatures = (newItem) => {
    const quantity = document.createElement('input');
    quantity.type = 'number';
    quantity.placeholder = 'Qty'
    const comments = document.createElement('input');
    comments.placeholder = 'Comments';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.dataset.checkbox = itemsCounter;
    const remove = document.createElement('button');
    remove.innerHTML = 'REMOVE';
    remove.dataset.remove = itemsCounter;
    newItem.append(quantity, comments, check, remove);
}

document.querySelector('.insertProductBtn').addEventListener('click', function(){
const product = userInput.value;
itemsCounter++;
createNewItem(product);
userInput.value = '';
userInput.focus();
})

document.querySelector('.orderAZ').addEventListener('click', function() {
const array = [];
    document.querySelectorAll('[data-item]').forEach((item) => {
    array.push(item)
});

if(this.innerText === 'A-Z'){
array.sort((a, b) => {
const itemA = a.innerText;
const itemB = b.innerText;
if(itemA < itemB) return -1;
});
}
else{
array.sort((a, b) => {
    const itemA = a.innerText;
    const itemB = b.innerText;
    if(itemA > itemB) return -1;
    });
}
productList.innerHTML = '';

array.forEach((item) => {
productList.append(item);
})

this.innerText === 'A-Z' ? this.innerText = 'Z-A' : this.innerText = 'A-Z';

});

productList.addEventListener('click', (event) => {
    const removeBtn = event.target.dataset.remove;
    const checkBox = event.target.dataset.checkbox;
    console.log(event)
    if (removeBtn) {
      const itemToRemove = event.target.parentElement;
      productList.removeChild(itemToRemove);
    }
    if(checkBox) {
event.target.parentElement.childNodes.forEach((c) => {
    if(!c.dataset.checkbox){
    c.disabled = true;
    c.classList.toggle('checked');}
});
    }
  });