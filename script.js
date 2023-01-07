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
    const remove = document.createElement('button');
    remove.innerHTML = 'REMOVE';
    newItem.append(quantity, comments, remove)
}

document.querySelector('.insertProductBtn').addEventListener('click', () => {
const product = userInput.value;
itemsCounter++;
createNewItem(product);
userInput.value = '';
userInput.focus();
})