const userInput = document.querySelector(".userInput");
const itemsList = document.querySelector(".itemsList");
let itemsCounter = 0;

const createNewItem = (item) => {
  const newItem = document.createElement("li");
  newItem.dataset.item = itemsCounter;
  newItem.dataset.itemName = item;
  itemsList.appendChild(newItem);
  addItemsFeatures(newItem, item);
};

const addItemsFeatures = (newItem) => {
  const itemName = document.createElement("span");
  itemName.innerHTML = newItem.dataset.itemName;
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
  .querySelector(".insertItemBtn")
  .addEventListener("click", function () {
    const item = userInput.value.replace(/^\w/, c => c.toUpperCase())
    const VALID_ITEM = /^[^0-9]{2,}$/
    if(VALID_ITEM.test(item)){
    itemsCounter++;
    createNewItem(item);
    userInput.value = "";
    userInput.focus();}
  });

document.querySelector(".orderAZ").addEventListener("click", function () {
  const array = [];
  document.querySelectorAll("[data-item]").forEach((item) => {
    array.push(item);
  });
  
  array.sort((a, b) => {
      const itemA = a.dataset.itemName;
      const itemB = b.dataset.itemName;
      if (this.innerText === "A-Z") { 
      if (itemA < itemB) return -1;}
      else{if (itemA > itemB) return -1;}
    });
    
  itemsList.innerHTML = "";

  array.forEach((item) => {
    itemsList.append(item);
  });

  this.innerText === "A-Z"
    ? (this.innerText = "Z-A")
    : (this.innerText = "A-Z");
});

itemsList.addEventListener("click", (event) => {
  const removeBtn = event.target.dataset.remove;
  const checkBox = event.target.dataset.checkbox;
  if (removeBtn) {
    const itemToRemove = event.target.parentElement;
    itemsList.removeChild(itemToRemove);
  }
  if (checkBox) {
    event.target.parentElement.classList.toggle('disabled');
    event.target.parentElement.childNodes.forEach((c) => {
    if (!c.dataset.checkbox && !c.dataset.remove) {
          c.disabled = event.target.checked;
        }
    });
  }
});
