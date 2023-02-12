const navBar = document.querySelector(".navBar");
const container = document.querySelector('.container');
const search = document.querySelector(".search");
const searchResults = document.querySelector(".searchResults");
const allItems = document.querySelector(".allGroceries");
const activeList = document.querySelector(".listContainer");
const itemsList = document.querySelector(".itemsList");
const validRemove = document.querySelector(".validRemove");
const choosePreference = document.querySelector(".choosePreference");
const userPreferenceCheckboxs = document.querySelector(".userPreference");

const saveItemToDb = async (id, btn) => {
  btn.disabled = 'disabled';
  search.value = '';
  searchResults.innerHTML = '';
  search.focus();
  await fetch(`http://localhost:3000/${id}`, { method: "POST" });
  await fetch(`http://localhost:3000/${id}`, { method: "PATCH" });
  
};

window.onload = async () => {
  document.querySelector('.allItems').classList.add('disabled');
};

navBar.addEventListener("click", (event) => {
  const activeList = event.target.classList.contains("activeList");
  const searchResult = event.target.classList.contains("searchResult");
  if (activeList) return location.replace("/list");
  if (searchResult) {
    saveItemToDb(event.target.dataset.id);
    searchResults.innerHTML = "";
    search.value = "";
  }
});

search.addEventListener("keyup", async (event) => {
  const text = event.target.value;
  if (!text) return (searchResults.innerHTML = "");
  const result = await fetch(`http://localhost:3000/${text}`);
  const data = await result.json();
  searchResults.innerHTML = "";
let type;
  data.forEach((item) => {
    const typeTitle = document.createElement('h3');
    const newItem = document.createElement("li");
    const addBtn = document.createElement('button');
    typeTitle.innerHTML = item.type;
    newItem.innerHTML = item.name;
    newItem.dataset.id = item._id;
    newItem.classList.add("searchResult");
    addBtn.classList.add('addItem', 'fa-solid', 'fa-plus');
    addBtn.dataset.id = item._id;
    if(item.onList) addBtn.disabled = 'disabled';
    newItem.appendChild(addBtn);
    if(typeTitle.innerHTML === type) return searchResults.append(newItem)
    searchResults.append(typeTitle, newItem);
    type = item.type;
  });
});

container.addEventListener("click", (event) => {
  const addItem = event.target.classList.contains("addItem");
  if (addItem) return saveItemToDb(event.target.dataset.id, event.target);
});
