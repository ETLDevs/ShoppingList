const navBar = document.querySelector(".navBar");
const search = document.querySelector('.search');
const searchResults = document.querySelector(".searchResults");
const allItems = document.querySelector(".allGroceries");
const activeList = document.querySelector(".listContainer");
const itemsList = document.querySelector(".itemsList");
const removeChecked = document.querySelector(".removeChecked");
const validRemove = document.querySelector(".validRemove");
const ALERTS = {
  updated: "Item updated",
  deleted: "Item deleted",
  checkedDeleted: "All checked items deleted",
  allDeleted: "All items deleted",
  noCheked: "No checked items found",
  emptyList: "The list is empty",
};
const VALID_ITEM = /^[^0-9]{2,}$/;
let itemsCounter = 0;

const removeValidation = (deleteFunc, argument) => {
  validRemove.classList.remove("hidden");

  const onClick = (event) => {
    const remove = event.target.classList.contains("acceptRemove");
    const cancel = event.target.classList.contains("cancelRemove");

    if (cancel) {
      validRemove.classList.add("hidden");
      validRemove.removeEventListener("click", onClick);
    }

    if (remove) {
      validRemove.classList.add("hidden");
      argument === "undefined" ? deleteFunc() : deleteFunc(argument);
    }
  };
  validRemove.addEventListener("click", onClick);
};
const snackbar = (alert) => {
  new Snackbar.show({
    pos: "bottom-left",
    text: alert,
    showAction: false,
    textColor: "white",
    backgroundColor: "green",
    duration: 2000,
  });
};

const emptyList = async () => {
  const result = await fetch(`http://localhost:3000/list/all`, {
    method: "DELETE",
  });
  const { status } = await result.json();
  if (status === "success") {
    snackbar(ALERTS.allDeleted);
    itemsList.innerHTML = "";
  }
};

const removeChecks = async () => {
  const result = await fetch(`http://localhost:3000/list/checked`, {
    method: "DELETE",
  });
  const { status } = await result.json();
  if (status === "success") {
    snackbar(ALERTS.checkedDeleted);
    itemsList.querySelectorAll(".checkbox").forEach((checkbox) => {
      if (checkbox.checked) {
        itemsList.removeChild(checkbox.parentElement);
      }
    });
  }
};

const removeItem = async (item) => {
  const result = await fetch(`http://localhost:3000/list/${item.dataset.id}`, {
    method: "DELETE",
  });
  const { status } = await result.json();
  if (status === "success") {
    snackbar(ALERTS.deleted);
    itemsList.removeChild(item.parentElement);
  }
};

const disableItem = (checkbox) => {
  if (!checkbox.checked) {
    return checkbox.parentElement.classList.remove("disabled");
  }
  checkbox.parentElement.classList.add("disabled");
};

window.onload = () => {
  const checked = document.querySelectorAll('input[class="checkbox"]:checked');
  checked.forEach((check) => {
    check.parentElement.classList.add("disabled");
  });
};

navBar.addEventListener("click", (event) => {
  const allItems = event.target.classList.contains("allItems");
  if (allItems) return location.replace("/");
});

search.addEventListener('keyup', async event => {
const text = event.target.value;
if(!text) { 
  location.reload();
  search.focus();
}
const result = await fetch(`http://localhost:3000/list/${text}`);
const {filteredItems} = await result.json();
if (!filteredItems.length) return;
itemsList.innerHTML = ''
filteredItems.forEach(item => {
const newItem = document.createElement('li');
const icon = document.createElement('i');
const itemName = document.createElement('span');
const quantity = document.createElement('input');
const comments = document.createElement('input')
const checkbox = document.createElement('input');
const delBtn = document.createElement('button');
  newItem.dataset.name = item.item.name;
  newItem.dataset.type = item.item.type;
  newItem.dataset.id = item.item._id;
  icon.classList.add('fa-solid', item.item.icon);
  itemName.innerHTML = item.item.name;
  quantity.type = 'number';
  quantity.value = item.quantity;
  comments.value = item.comments;
  checkbox.type = 'checkbox';
  checkbox.checked = item.checked;
  delBtn.dataset.id = item._id;
  delBtn.classList.add('fa-solid','fa-trash-can' ,'remove')
  newItem.append(icon, itemName, quantity, comments, checkbox, delBtn)
  itemsList.appendChild(newItem);
})
});

activeList.addEventListener("click", (event) => {
  const orderByAZ = event.target.classList.contains("orderByAZ");
  const orderByType = event.target.classList.contains("orderByType");
  const removeChecked = event.target.classList.contains("removeChecked");
  const removeAll = event.target.classList.contains("removeAll");
  const array = [];
  const button = event.target;

  if (orderByAZ || orderByType || removeChecked || removeAll) {
    if (!itemsList.children.length) {
      return snackbar(ALERTS.emptyList);
    }
  }
  if (orderByAZ || orderByType) {
    activeList.querySelectorAll("[data-name]").forEach((item) => {
      array.push(item);
    });
  }
  if (orderByAZ) {
    array.sort((a, b) => {
      const itemA = a.dataset.name;
      const itemB = b.dataset.name;
      if (button.innerText === "A-Z") {
        if (itemA < itemB) return -1;
      } else {
        if (itemA > itemB) return -1;
      }
    });
    button.innerText = button.innerText === "A-Z" ? "Z-A" : "A-Z";
  }

  if (orderByType) {
    array.sort((a, b) => {
      const itemA = a.dataset.type;
      const itemB = b.dataset.type;
      if (itemA < itemB) return -1;
    });
  }
  if (orderByAZ || orderByType) {
    itemsList.innerHTML = "";
    array.forEach((item) => {
      itemsList.append(item);
    });
  }
  if (removeChecked) {
    if (
      itemsList.children.length &&
      !document.querySelectorAll('input[class="checkbox"]:checked').length
    ) {
      return snackbar(ALERTS.noCheked);
    }
    removeValidation(removeChecks);
  }

  if (removeAll) {
    removeValidation(emptyList);
  }
});

itemsList.addEventListener("click", (event) => {
  const removeBtn = event.target.classList.contains("remove");
  const checkBox = event.target.classList.contains("checkbox");

  if (removeBtn) return removeValidation(removeItem, event.target);
  if (checkBox) return disableItem(event.target);
});

itemsList.addEventListener("change", async (event) => {
  const id = event.target.parentElement.children[5].dataset.id;
  const quantity = event.target.parentElement.children[2].value;
  const comments = event.target.parentElement.children[3].value;
  const checked = event.target.parentElement.children[4].checked;
  const body = {
    quantity: quantity,
    comments: comments,
    checked: checked,
  };
  const result = await fetch(`http://localhost:3000/list/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const { status } = await result.json();
  if (status === "success") {
    snackbar(ALERTS.updated);
  }
});
