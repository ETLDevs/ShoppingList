const userInput = document.querySelector(".userInput");
const itemsList = document.querySelector(".itemsList");
const VALID_ITEM = /^[^0-9]{2,}$/;
let itemsCounter = 0;

const getIcon = async (itemName) => {
   const response = await fetch(`http://localhost:3000/groceries/${itemName}`);
   const icon = response.json() 
  return icon
  };

const enterItem = () => {
  const item = userInput.value;
  if (VALID_ITEM.test(item)) {
    itemsCounter++;
    createNewItem(item);
    userInput.value = "";
    userInput.focus();
  }
}

const createNewItem = async item => {
  const newItem = document.createElement("li");
  newItem.dataset.item = itemsCounter;
  newItem.dataset.itemName = item;
  itemsList.appendChild(newItem);
 const icon = await getIcon(item);
  addItemsFeatures(newItem, icon);
};

const addItemsFeatures = (newItem, icon) => {
  const typeIcon = document.createElement('i');
  typeIcon.classList.add('fa-solid', icon);
  const itemName = document.createElement("input");
  itemName.disabled = true;
  itemName.title = 'Double click to edit';
  itemName.classList.add('itemName');
  itemName.value = newItem.dataset.itemName.replace(/^\w/, (c) => c.toUpperCase());
  const saveEditBtn = document.createElement('button');
  saveEditBtn.innerHTML = "Save";
  saveEditBtn.classList.add('saveEdit', 'hidden');
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
  newItem.append(typeIcon, saveEditBtn, itemName, quantity, comments, check, remove);
};

userInput.addEventListener("keydown", event => {
  if (event.keyCode === 13) {
    enterItem();
  }
});

document.querySelector(".insertItemBtn").addEventListener("click", () => {
  enterItem();
});

document.querySelector(".orderAZ").addEventListener("click",  event => {
  const array = [];
  const button = event.target;
  document.querySelectorAll("[data-item]").forEach(item => {
    array.push(item);
  });

  array.sort((a, b) => {
    const itemA = a.dataset.itemName;
    const itemB = b.dataset.itemName;
    if (button.innerText === "A-Z") {
      if (itemA < itemB) return -1;
    } else {
      if (itemA > itemB) return -1;
    }
  });

  itemsList.innerHTML = "";

  array.forEach(item => {
    itemsList.append(item);
  });

  button.innerText === "A-Z"
    ? (button.innerText = "Z-A")
    : (button.innerText = "A-Z");
});

itemsList.addEventListener("click", async event => {
  const removeBtn = event.target.dataset.remove;
  const checkBox = event.target.dataset.checkbox;
  const itemsName = event.target.classList.contains('itemName'); 
  const saveEditBtn = event.target.classList.contains('saveEdit');
  const item = event.target.parentElement;
  if (removeBtn) {
    const itemToRemove = event.target.parentElement;
    itemsList.removeChild(itemToRemove);
    return;
  }
  if (checkBox) {
    item.classList.toggle("disabled");
    item.childNodes.forEach((c) => {
      if (!c.dataset.checkbox && !c.dataset.remove && !c.classList.contains('itemName')) {
        c.disabled = event.target.checked;
        return;
      }
    });
  }
  if (itemsName) {
    event.target.disabled = false;
    event.target.previousSibling.classList.remove('hidden');
  }
  if (saveEditBtn) {
    const itemsName = event.target.nextSibling;
    const typeIcon = event.target.previousSibling;
    typeIcon.classList.add("fa-solid", await getIcon(itemsName.value.toLowerCase()));
    itemsName.value = itemsName.value.replace(/^\w/, (c) => c.toUpperCase());
    itemsName.disabled = true;
    item.dataset.itemName = itemsName.value;
    event.target.classList.add('hidden');
  }
});
