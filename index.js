
// 2. Допустим, что по url
//  http://любой_домен/filter?size=M&color=1&color=2&manufacturer=aaa&manufacturer=ddd 
//находится страница, на которой есть такие поля:
// радио для size (значения - S, M, L)
// несколько чекбоксов для color (значения - 1, 2, 3, 4, 5)
// мультиселект (select multiple) для manufacturer
//  (значения - "aaa", "b&c", "ddd", "eee") 
// чекбокс "распродажа" (значение - 1)
// Допустим также, что сервер при генерации html ни
//  одно из полей не заполняет, то есть радио не выбран,
//   чекбоксы пустые и т.д.

// Задача: набросать самую элементарную разметку для
//  указанных инпутов и написать скрипт, который 
// при загрузке страницы разберёт значения фильтров из url
//  и расставит их по соответствующим полям
// при изменении состояния в любом инпуте, кроме 
// "распродажа", выведет в консоль аналогичный приведённому
//  в условии url с актуальными значениями фильтров


const container = document.getElementById("container");
const urlParam = window.location.search.replace(/\?/g, "");
const arrParam = urlParam.split("&");
const size = [...(document.querySelectorAll(".size"))];
const color = [...(document.querySelectorAll(".color"))];
const manufacturer = document.getElementById("manufacturer");
const arrOptions = ([...manufacturer.options]);
const sale = [...(document.querySelectorAll(".sale"))];

const setParamAttr = (paramUrl, valueParamUrl) => {
  paramUrl.forEach(element => {
    if (element.value === valueParamUrl && element.type) {
      element.setAttribute("checked", "");
    } else if (element.label === valueParamUrl) {
      element.setAttribute("selected", "")
    }
  });
};

const changeParam = (param, valueParam) => {
  if (param === "size") {
    setParamAttr(size, valueParam);
  }
  if (param === "color") {
    setParamAttr(color, valueParam);
  }
  if (param === "manufacturer") {
    setParamAttr(arrOptions, valueParam);
  }
  if (param === "sale") {
    setParamAttr(sale, valueParam);
  }
};
arrParam.forEach((item, index) => {
  if (item.length < 2 && item.length > 0) {
    arrParam[index - 1] =
      arrParam[index - 1].concat(`&${item}`);
    arrParam.splice(index, 1);
  }
});
arrParam.forEach((item) => {
  let arrNameValueParam = item.split("=");
  changeParam(arrNameValueParam[0], arrNameValueParam[1]);
});

//Изменение параметров

let colorNewValue = "";
let sizeNewValue = "";
const valueCheckedSize = size.filter(el => {
  if (el.hasAttribute("checked")) return el;
});
if (valueCheckedSize[0]) {
  sizeNewValue = `size=${valueCheckedSize[0].value}`;
}
const sizeBlock = document.getElementById("size_block");
const colorBlock = document.getElementById("color_block");
sizeBlock.onchange = (event) => {
  size.map(el => {
    el.removeAttribute("checked");
  });
  event.target.setAttribute("checked", "");
  sizeNewValue = `size=${event.target.value}`;
}
colorBlock.onchange = (event) => {
  event.target.hasAttribute("checked") ?
    event.target.removeAttribute("checked") :
    event.target.setAttribute("checked", "");
};

container.addEventListener("change", () => {
  const arrSelectedOptions = [];
  const arrNewManufacturer =
    [...document.getElementById("manufacturer").options];
  arrNewManufacturer.forEach(el => {
    if (el.selected) arrSelectedOptions.push(`manufacturer=${el.value}`);
  });
  const arrNewColor = [];
  color.forEach(el => {
    if (el.hasAttribute("checked")) arrNewColor.push(`color=${el.value}`);
  });
  const newUrl =
    `?${sizeNewValue}&${arrNewColor.join("&")}&${arrSelectedOptions.join("&")}`;
  console.log(newUrl);

});