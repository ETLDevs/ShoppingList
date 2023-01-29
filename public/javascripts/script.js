const userInput = document.querySelector(".userInput");
const itemsList = document.querySelector(".itemsList");
const camDisplay = document.querySelector(".camDisplay");
const camera = document.querySelector(".camera");
const shoot = document.querySelector(".shoot");
const pictureSrc = document.querySelector(".pictureSrc");
const choosePreference = document.querySelector('.choosePreference');
const userPreferenceCheckboxs = document.querySelector(".userPreference");
const TYPE_HIERARCHY = {
  vegetable: "",
  fruit: "",
  drinks: "",
  alcohol: "",
  cooking: "",
  grain: "",
  pharm: "",
  cleaning: "",
  dairy: "",
  meat: "",
};
const VALID_ITEM = /^[^0-9]{2,}$/;
let itemsCounter = 0;

const getProperties = async (itemName) => {
  const response = await fetch(`http://localhost:3000/groceries/${itemName}`);
  const properties = await response.json();
  if (!properties.length) return { icon: "fa-question", type: "undefiend" };
  return { icon: properties[0].icon, type: properties[0].type };
};

const enterItem = () => {
  const item = userInput.value;
  if (VALID_ITEM.test(item)) {
    itemsCounter++;
    createNewItem(item);
    userInput.value = "";
    userInput.focus();
  }
};

const createNewItem = async (item) => {
  const newItem = document.createElement("li");
  newItem.dataset.item = itemsCounter;
  newItem.dataset.itemName = item;
  itemsList.appendChild(newItem);
  const { icon, type } = await getProperties(item);
  addItemsFeatures(newItem, icon, type);
};

const addItemsFeatures = (newItem, icon, type) => {
  newItem.dataset.type = type;
  const typeIcon = document.createElement("i");
  typeIcon.classList.add("fa-solid", icon);
  const itemName = document.createElement("input");
  itemName.disabled = true;
  itemName.title = "Double click to edit";
  itemName.classList.add("itemName");
  itemName.value = newItem.dataset.itemName.replace(/^\w/, (c) =>
    c.toUpperCase()
  );
  const saveEditBtn = document.createElement("button");
  saveEditBtn.innerHTML = "Save";
  saveEditBtn.classList.add("saveEdit", "hidden");
  const quantity = document.createElement("input");
  quantity.type = "number";
  quantity.placeholder = "Qty";
  const comments = document.createElement("input");
  comments.placeholder = "Comments";
  const camera = document.createElement("button");
  camera.classList.add("camera", "fa-solid", "fa-camera");
  const picture = document.createElement("img");
  picture.classList.add("picture", "hidden");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.dataset.checkbox = itemsCounter;
  const remove = document.createElement("button");
  remove.innerHTML = "REMOVE";
  remove.dataset.remove = itemsCounter;
  newItem.append(
    typeIcon,
    saveEditBtn,
    itemName,
    quantity,
    comments,
    camera,
    picture,
    check,
    remove
  );
};

const removeItem = (item) => {
  itemsList.removeChild(item);
};

const checkItem = (item, event) => {
  item.classList.toggle("disabled");
  item.childNodes.forEach((c) => {
    if (
      !c.dataset.checkbox &&
      !c.dataset.remove &&
      !c.classList.contains("itemName")
    ) {
      c.disabled = event.target.checked;
    }
  });
};

const editItem = (event) => {
  event.target.disabled = false;
  event.target.previousSibling.classList.remove("hidden");
};

const saveItem = async (event) => {
  const itemsName = event.target.nextSibling;
  const typeIcon = event.target.previousSibling;
  typeIcon.classList.remove(typeIcon.classList.item(1));
  const { icon, type } = await getProperties(itemsName.value.toLowerCase());
  typeIcon.classList.add(icon);
  event.target.parentElement.dataset.type = type;
  itemsName.value = itemsName.value.replace(/^\w/, (c) => c.toUpperCase());
  itemsName.disabled = true;
  event.target.parentElement.dataset.itemName = itemsName.value;
  event.target.classList.add("hidden");
};

const takeAPicture = async (picture) => {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true });
  camDisplay.classList.remove("hidden");
  camera.srcObject = stream;
  shoot.onclick = () => {
    pictureSrc
      .getContext("2d")
      .drawImage(camera, 0, 0, pictureSrc.width, pictureSrc.height);
    camDisplay.classList.add("hidden");
    picture.src = pictureSrc.toDataURL("image/jpeg");
    picture.classList.remove("hidden");
  };
};

const removePicture = (picture) => {
  picture.src = "";
  picture.classList.add("hidden");
};

const userPreference = () => {
  userPreferenceCheckboxs.classList.remove("hidden");
  let mainCounter = -1;
  let unchecked;
  userPreferenceCheckboxs.addEventListener("click", (event) => {
    const saveDefaultBtn = event.target.classList.contains("saveDefault");
    const savePreferenceBtn = event.target.classList.contains("savePreference");
    const orderNum = event.target.parentElement.children[1];

    if (event.target.checked) {
      mainCounter++;
      orderNum.innerHTML = mainCounter + 1;
      TYPE_HIERARCHY[event.target.dataset.type] = mainCounter;
    }
    if (event.target.checked === false) {
      mainCounter--;
      unchecked = TYPE_HIERARCHY[event.target.dataset.type];
      TYPE_HIERARCHY[event.target.dataset.type] = "";
      for (let type in TYPE_HIERARCHY) {
        if (TYPE_HIERARCHY[type] > unchecked) {
          TYPE_HIERARCHY[type]--;
        }
      }
      userPreferenceCheckboxs.querySelectorAll(".orderNum").forEach((num) => {
        if (parseInt(num.innerHTML) > parseInt(orderNum.innerHTML)) {
          num.innerHTML = parseInt(num.innerHTML-1)
        }
      });
      orderNum.innerHTML = "";
    }
    if (saveDefaultBtn) {
      let counter = 0;
      for (const type in TYPE_HIERARCHY) {
        TYPE_HIERARCHY[type] = counter++;
      }
    }
    if (savePreferenceBtn) {
      let counter = mainCounter + 1;
      userPreferenceCheckboxs
        .querySelectorAll("[data-type]")
        .forEach((check) => {
          if (!check.checked) {
            TYPE_HIERARCHY[check.dataset.type] = counter++;
          }
        });
    }
    if (saveDefaultBtn || savePreferenceBtn) {
      userPreferenceCheckboxs.classList.add("hidden");
    }
  });
};

userInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    enterItem();
  }
});

document.querySelector(".insertItemBtn").addEventListener("click", () => {
  enterItem();
});

document.addEventListener("click", (event) => {
  const orderByAZ = event.target.classList.contains("orderByAZ");
  const orderByType = event.target.classList.contains("orderByType");
  const array = [];
  if (orderByAZ) {
    const button = event.target;
    itemsList.querySelectorAll("[data-item]").forEach((item) => {
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
    button.innerText === "A-Z"
      ? (button.innerText = "Z-A")
      : (button.innerText = "A-Z");
  }

  if (orderByType) {
    if(Object.values(TYPE_HIERARCHY)[0] === '') return choosePreference.focus();
    itemsList.querySelectorAll("[data-type]").forEach((item) => {
      item.dataset.order = TYPE_HIERARCHY[item.dataset.type];
      array.push(item);
    });
    array.sort((a, b) => {
      const itemA = a.dataset.order;
      const itemB = b.dataset.order;
      if (itemA < itemB) return -1;
    });
  }
  if (orderByAZ || orderByType) {
    itemsList.innerHTML = "";
    array.forEach((item) => {
      itemsList.append(item);
    });
  }
});

choosePreference.addEventListener("click", () => {
  userPreference();
  userPreferenceCheckboxs.querySelectorAll("[data-type]").forEach((type) => {
    TYPE_HIERARCHY[type.dataset.type] = "";
    type.checked = false;
  });
  userPreferenceCheckboxs.querySelectorAll(".orderNum").forEach((num) => {
    num.innerHTML = "";
  });
});

itemsList.addEventListener("click", (event) => {
  const item = event.target.parentElement;
  const removeBtn = event.target.dataset.remove;
  const checkBox = event.target.dataset.checkbox;
  const itemsName = event.target.classList.contains("itemName");
  const saveEditBtn = event.target.classList.contains("saveEdit");
  const camera = event.target.classList.contains("camera");
  const picture = event.target.classList.contains("picture");
  if (removeBtn) return removeItem(item);
  if (checkBox) return checkItem(item, event);
  if (itemsName) return editItem(event);
  if (saveEditBtn) return saveItem(event);
  if (camera) return takeAPicture(event.target.nextSibling);
  if (picture) return removePicture(event.target);
});
