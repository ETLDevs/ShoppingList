const userInput = document.querySelector('.userInput');
const productList = document.querySelector('.productList');

const createNewItem = (product) => {
    const newItem = document.createElement('li');
    newItem.innerHTML = product;
    productList.appendChild(newItem);
}

document.querySelector('.insertProductBtn').addEventListener('click', () => {
const product = userInput.value;
createNewItem(product);
userInput.value = '';
userInput.focus();
})