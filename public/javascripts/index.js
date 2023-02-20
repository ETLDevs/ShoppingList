const navBar = document.querySelector(".navBar");
const container = document.querySelector(".container");
const search = document.querySelector(".search");
const searchResults = document.querySelector(".searchResults");
const activeList = document.querySelector(".listContainer");

const saveItemToDb = async (id, btn) => {
  if (btn.parentElement.parentElement === searchResults) {
    searchResults.innerHTML = "";
    search.value = "";
    search.focus();
  }
  const result = await fetch(`http://localhost:3000/${id}`, { method: "POST" });
  const { status } = await result.json();
  if (status === "success") {
    document.querySelectorAll(`[data-id="${id}"]`).forEach((btn) => {
      btn.disabled = "disabled";
    });
  }
  new Snackbar.show({
    pos: "bottom-left",
    text:
      status === "success"
        ? "Item added successfully"
        : "Item could not be added",
    showAction: false,
    textColor: "black",
    backgroundColor: status === "success" ? "green" : "red",
    duration: 2000,
  });
};

navBar.addEventListener("click", (event) => {
  const activeList = event.target.classList.contains("activeList");
  const searchResult = event.target.classList.contains("searchResult");
  if (activeList) {
    return location.replace("/list");
  }
  if (searchResult) {
    saveItemToDb(event.target.dataset.id);
    searchResults.innerHTML = "";
    search.value = "";
  }
});

search.addEventListener("keyup", async (event) => {
  const text = event.target.value;
  if (!text) {
    searchResults.innerHTML = "";
    return
  }
  const result = await fetch(`http://localhost:3000/${text}`);
  const data = await result.json();
  searchResults.innerHTML = "";
  let type;
  data.forEach((item) => {
    const typeTitle = document.createElement("h3");
    const newItem = document.createElement("li");
    const addBtn = document.createElement("button");
    typeTitle.innerHTML = item.type;
    newItem.innerHTML = item.name;
    newItem.dataset.id = item._id;
    newItem.classList.add("searchResult");
    addBtn.classList.add("addItem", "fa-solid", "fa-plus");
    addBtn.dataset.id = item._id;
    if (item.onList) addBtn.disabled = "disabled";
    newItem.appendChild(addBtn);
    if (typeTitle.innerHTML === type) return searchResults.append(newItem);
    searchResults.append(typeTitle, newItem);
    type = item.type;
  });
});

container.addEventListener("click", (event) => {
  const addItem = event.target.classList.contains("addItem");
  if (addItem) return saveItemToDb(event.target.dataset.id, event.target);
});
