const navBar = document.querySelector(".navBar");
const search = document.querySelector(".search");
const searchResults = document.querySelector(".searchResults");
const allItems = document.querySelector(".allGroceries");
const activeList = document.querySelector(".listContainer");
const itemsList = document.querySelector(".itemsList");
const validRemove = document.querySelector(".validRemove");
const choosePreference = document.querySelector(".choosePreference");
const userPreferenceCheckboxs = document.querySelector(".userPreference");

const saveItemToDb = async (id) => {
  await fetch(`http://localhost:3000/${id}`, { method: "POST" });
};

navBar.addEventListener("click", (event) => {
  const toggleLists = event.target.classList.contains("toggleLists");
  const searchResult = event.target.classList.contains("searchResult");
  if (toggleLists) return location.replace("/list");
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

  data.forEach((item) => {
    const newItem = document.createElement("li");
    newItem.innerHTML = item.name;
    newItem.dataset.id = item._id;
    newItem.classList.add("searchResult");
    searchResults.appendChild(newItem);
  });
});

allItems.addEventListener("click", (event) => {
  const addItem = event.target.classList.contains("addItem");
  if (addItem) return saveItemToDb(event.target.dataset.id);
});
