const navBar = document.querySelector(".navBar");
const search = document.querySelector('.search');
const searchResults = document.querySelector('.searchResults');
const allItems = document.querySelector(".allGroceries");
const activeList = document.querySelector(".listContainer");
const itemsList = document.querySelector(".itemsList");
const removeChecked = document.querySelector('.removeChecked')
const validRemove = document.querySelector(".validRemove");

const VALID_ITEM = /^[^0-9]{2,}$/;
let itemsCounter = 0;

const emptyList = () => {
  validRemove.classList.remove("hidden");
  validRemove.addEventListener("click", async (event) => {
    const remove = event.target.classList.contains("acceptRemove");
    const cancel = event.target.classList.contains("cancelRemove");
    if (cancel) return validRemove.classList.add("hidden");
    if (remove) {
      validRemove.classList.add("hidden");
      const result = await fetch(`http://localhost:3000/list`, {
        method: "DELETE",
      });
      if (result.ok) return location.reload();
    }
  });
};

const removeChecks = () => {
  validRemove.classList.remove("hidden");
  validRemove.addEventListener("click", async (event) => {
    const remove = event.target.classList.contains("acceptRemove");
    const cancel = event.target.classList.contains("cancelRemove");
    if (cancel) return validRemove.classList.add("hidden");
    if (remove) {
      validRemove.classList.add("hidden");
    const result = await fetch(`http://localhost:3000/`, {
            method: "DELETE",
          });
       
  if (result.ok) return location.reload();
  }
})
};

const removeItem = (item) => {
  validRemove.classList.remove("hidden");
  validRemove.addEventListener("click", async (event) => {
    const remove = event.target.classList.contains("acceptRemove");
    const cancel = event.target.classList.contains("cancelRemove");
    if (cancel) return validRemove.classList.add("hidden");
    if (remove) {
      validRemove.classList.add("hidden");
      const result = await fetch(`http://localhost:3000/${item.dataset.id}`, {
        method: "DELETE",
      });
      if (result.ok) return location.reload();
    }
  });
};

const disableItem = (checkbox) => {
  if (!checkbox.checked)
    return checkbox.parentElement.classList.remove("disabled");
};



const saveItemToDb = async (id) => {
  await fetch(`http://localhost:3000/${id}`, { method: "POST" });
};

window.onload = () => {
  document.querySelectorAll(".checkbox").forEach((check) => {
    if (check.checked) {
      check.parentElement.classList.add("disabled");
    }
  });
  document.querySelector('.activeList').classList.add('disabled');
};

navBar.addEventListener("click", (event) => {
  const allItems = event.target.classList.contains("allItems");
  if (allItems) return location.replace("/");
});

search.addEventListener('change', async event => {
const text = event.target.value;
if(!text) return location.reload();
itemsList.innerHTML = '';
const result = await fetch(`http://localhost:3000/list/${text}`);
const savedList = await result.json();
console.log(savedList)
// const data = await result.json();
// if (!data) return;
// itemsList.innerHTML = ''
// data.forEach(item => {
//   if(!item.item) return;
//   const newItem = document.createElement('li');
//   newItem.dataset.name = item.item.name;
//   newItem.dataset.type = item.item.type;
//   newItem.dataset.id = item.item._id;
//   newItem.innerHTML = item.item.name;
  
//   itemsList.appendChild(newItem);
// })
})

activeList.addEventListener("click", (event) => {
  const orderByAZ = event.target.classList.contains("orderByAZ");
  const orderByType = event.target.classList.contains("orderByType");
  const removeChecked = event.target.classList.contains('removeChecked');
  const removeAll = event.target.classList.contains("removeAll");


  const array = [];
  const button = event.target;
  activeList.querySelectorAll("[data-name]").forEach((item) => {
    array.push(item);
  });
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
    button.innerText === "A-Z"
      ? (button.innerText = "Z-A")
      : (button.innerText = "A-Z");
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

  if (removeChecked) return removeChecks()
  if (removeAll) return emptyList();
});


itemsList.addEventListener("click", (event) => {
  const removeBtn = event.target.classList.contains("remove");
  const checkBox = event.target.classList.contains("checkbox");

  if (removeBtn) return removeItem(event.target);
  if (checkBox) return disableItem(event.target);
});

itemsList.addEventListener("change", async (event) => {
  const id = event.target.parentElement.dataset.id;
  const quantity = event.target.parentElement.children[2].value;
  const comments = event.target.parentElement.children[3].value;
  const checked = event.target.parentElement.children[4].checked;
  const body = {
    quantity: quantity,
    comments: comments,
    checked: checked,
  };
  await fetch(`http://localhost:3000/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
});
