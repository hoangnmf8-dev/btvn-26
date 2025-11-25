const $ = document.querySelector.bind(document);
const ulNode = $("ul");
const menu = $(".menu");
const formUpdate = $(".form");
const modal = $(".modal");
const input = $("input");
const itemEls = ulNode.querySelectorAll(".item");
let currentItem;
let isCtrl = false;

const escapeHTML = (value) => {
  const div = document.createElement("div");
  const text = document.createTextNode(value);
  div.append(text);
  return div.innerHTML;
};

document.addEventListener("contextmenu", (e) => {
  if (e.target.matches(".content")) {
    e.preventDefault();
    const viewPortWidth = document.documentElement.clientWidth;
    const viewPortHeight = document.documentElement.clientHeight;
    const contextMenuWidth = +window.getComputedStyle(menu).width.replace("px", "");
    const contextMenuHeight = +window.getComputedStyle(menu).height.replace("px", "");
    let topContextMenu = 0;
    let leftContextMenu = 0;
    
    if(e.clientY + contextMenuHeight > viewPortHeight) {
      topContextMenu = e.pageY - contextMenuHeight;
    } else {
      topContextMenu = e.pageY;
    }
  
    if(e.clientX + contextMenuWidth > viewPortWidth) {
      leftContextMenu = e.pageX - contextMenuWidth;
    } else {
      leftContextMenu = e.pageX;
    }
    
    menu.style.top = `${topContextMenu}px`;
    menu.style.left = `${leftContextMenu}px`;
    menu.classList.replace("hidden", "inline-block");
    currentItem = e.target.parentNode;
  }

  if(e.target.closest(".menu")) e.preventDefault();
});

document.addEventListener("click", (e) => {
  //Close menu
  if (menu.classList.contains("inline-block")) {
    //ẩn menu ngay cả khi click chuột trái vào chính nó
    menu.classList.replace("inline-block", "hidden");
  }

  //Select element
  if (e.target.matches(".content")) {
    const itemActive = ulNode.querySelector(".item.active");
    const itemActiveNodeList = ulNode.querySelectorAll(".item.active");
    if (!isCtrl) {
      Array.from(itemActiveNodeList).push(e.target.parentNode);
      itemActiveNodeList.forEach((item) => item.classList.remove("active"));
    }

    if (itemActiveNodeList.length > 1) {
      e.target.parentNode.classList.add("active");
    } else {
      if (itemActive === e.target.parentNode) return;
      e.target.parentNode.classList.add("active");
    }
  }

  if(!e.target.closest(".item")) { // không dùng matches vì mathces trả về false, closest trả về phần tử cha
    ulNode.querySelectorAll(".item.active").forEach((item) => item.classList.remove("active"));
  }

  //Up
  if (e.target.matches(".up")) {
    const itemActive = e.target.parentNode;
    const previousItemActive = itemActive?.previousElementSibling;
    if (itemActive.classList.contains("active") && previousItemActive) {
      ulNode.insertBefore(itemActive, previousItemActive);
    }
  }

  //Down
  if (e.target.matches(".down")) {
    const itemActive = e.target.parentNode;
    const nextItemActive = itemActive?.nextElementSibling;
    if (itemActive.classList.contains("active") && nextItemActive) {
      ulNode.insertBefore(nextItemActive, itemActive);
    }
  }

  //Open form
  if (e.target.matches(".menu-update-name")) {
    modal.classList.remove("hidden");
    formUpdate.classList.remove("hidden");
    input.value = currentItem.querySelector(".content").innerText;
    input.focus();
  }

  //Close form
  if (e.target.matches(".modal")) {
    modal.classList.add("hidden");
    formUpdate.classList.add("hidden");
  }

  //Delete element
  if (e.target.matches(".menu-delete")) {
    currentItem.remove();
  }
});

formUpdate.addEventListener("submit", (e) => {
  e.preventDefault();
  modal.classList.add("hidden");
  formUpdate.classList.add("hidden");
  currentItem.querySelector(".content").innerText = escapeHTML(input.value);
});

document.addEventListener("keydown", (e) => {
  //Close modal and form
  if (e.key === "Escape") {
    formUpdate.classList.add("hidden");
    modal.classList.add("hidden");
    menu.classList.replace("inline-block", "hidden");
  }

  let isCopyDown = e.key === "ArrowDown" && e.shiftKey && e.altKey;
  let isCopyUp = e.key === "ArrowUp" && e.shiftKey && e.altKey;
  if (e.ctrlKey) isCtrl = true;

  if (!isCopyDown && !isCopyUp) return;
  const itemActive = ulNode.querySelectorAll(".item.active");
  itemActive.forEach((item) => { //
    const itemActiveClone = item.cloneNode(true);
    let text = item.querySelector(".content").innerText;
    
    itemActiveClone.querySelector(".content").innerText = `${text} - clone`;
    itemActiveClone.title = itemActiveClone.querySelector(".content").innerText; //hiện title lúc hover khi text quá dài
    itemActiveClone.classList.remove("active");
    if (isCopyDown) {
      ulNode.insertBefore(itemActiveClone, item.nextElementSibling);
    } else {
      ulNode.insertBefore(itemActiveClone, item);
    }
  });
});

document.addEventListener("keyup", (e) => {
  if (isCtrl) isCtrl = false;
});
