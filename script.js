const userInput = document.querySelector(".userInput");
const productList = document.querySelector(".productList");
let itemsCounter = 0;

const createNewItem = (product) => {
  const newItem = document.createElement("li");
  newItem.dataset.item = itemsCounter;
  productList.appendChild(newItem);
  addItemsFeatures(newItem, product);
};

const addItemsFeatures = (newItem, product) => {
  const itemName = document.createElement("span");
  itemName.innerHTML = product;
  const quantity = document.createElement("input");
  quantity.type = "number";
  quantity.placeholder = "Qty";
  const comments = document.createElement("input");
  comments.placeholder = "Comments";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.dataset.checkbox = itemsCounter;
  const remove = document.createElement("button");
  remove.innerHTML = "REMOVE";
  remove.dataset.remove = itemsCounter;
  newItem.append(itemName, quantity, comments, check, remove);
};

document
  .querySelector(".insertProductBtn")
  .addEventListener("click", function () {
    const product = userInput.value;
    const VALID_ITEM = /^[^0-9]{2,}$/
    if(VALID_ITEM.test(product)){
    itemsCounter++;
    createNewItem(product);
    userInput.value = "";
    userInput.focus();}
  });

document.querySelector(".orderAZ").addEventListener("click", function () {
  const array = [];
  document.querySelectorAll("[data-item]").forEach((item) => {
    array.push(item);
  });

  if (this.innerText === "A-Z") {
    array.sort((a, b) => {
      const itemA = a.innerText;
      const itemB = b.innerText;
      if (itemA < itemB) return -1;
    });
  } else {
    array.sort((a, b) => {
      const itemA = a.innerText;
      const itemB = b.innerText;
      if (itemA > itemB) return -1;
    });
  }
  productList.innerHTML = "";

  array.forEach((item) => {
    productList.append(item);
  });

  this.innerText === "A-Z"
    ? (this.innerText = "Z-A")
    : (this.innerText = "A-Z");
});

productList.addEventListener("click", (event) => {
  const removeBtn = event.target.dataset.remove;
  const checkBox = event.target.dataset.checkbox;
  if (removeBtn) {
    const itemToRemove = event.target.parentElement;
    productList.removeChild(itemToRemove);
  }
  if (checkBox) {
    event.target.parentElement.classList.toggle('disabled');
    event.target.parentElement.childNodes.forEach((c) => {
      if (event.target.checked) {
        if (!c.dataset.checkbox && !c.dataset.remove) {
          c.disabled = true;
        }
      } else {
        c.disabled = false;
      }
    });
  }
});
