const userInput = document.querySelector('.userInput');
const productList = document.querySelector('.productList');
let itemsCounter = 0;

const createNewItem = (product) => {
    const newItem = document.createElement('li');
    newItem.innerHTML = product;
    newItem.dataset.item = itemsCounter;
    productList.appendChild(newItem);
}

document.querySelector('.insertProductBtn').addEventListener('click', () => {
const product = userInput.value;
itemsCounter++;
createNewItem(product);
userInput.value = '';
userInput.focus();
})