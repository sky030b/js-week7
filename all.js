console.clear();
let data = [];

axios.get("https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json")
  .then((res) => {
    data = res.data.data;
    showSpots();

    let areaObj = getAreaObj(data);
    let areaArr = objToArr(areaObj);
    renderChart(areaArr);
    // renderChart(objToArr(getAreaObj(data)));
  })
  .catch((error) => {
    console.log(error);
  })

const addTicketForm = document.querySelector(".addTicket-form");
const inputs = document.querySelectorAll(".addTicket-input input, .addTicket-input textarea, .addTicket-input select");
const alerts = document.querySelectorAll(".alert-message p");
const showAlertText = document.querySelector(".alert-message-text p");
const addTicketBtn = document.querySelector(".addTicket-btn");

const regionSearch = document.querySelector(".regionSearch");
const searchResult = document.querySelector("#searchResult-text");
const ticketCardAll = document.querySelector(".ticketCard-area");
const cantFindArea = document.querySelector(".cantFind-area");

// for controling the alert message
alerts.forEach((item, index) => {
  item.style.display = "none";
  inputs[index].addEventListener("input", function (e) {
    if (e.target.value) {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  })
})

// for show ths spots
function showSpots() {
  cantFindArea.style.display = "none";

  let liStr = "";
  let filterData = [];
  const render = (item) => {
    liStr += `
    <li class="ticketCard">
      <div class="ticketCard-img">
        <a href="#">
          <img
            src="${item.imgUrl}"
            alt=""
          >
        </a>
        <div class="ticketCard-region">${item.area}</div>
        <div class="ticketCard-rank">${item.rate}</div>
      </div>
      <div class="ticketCard-content">
        <div>
          <h3>
            <a
              href="#"
              class="ticketCard-name"
            >${item.name}</a>
          </h3>
          <p class="ticketCard-description">${item.description}</p>
        </div>
        <div class="ticketCard-info">
          <p class="ticketCard-num">
            <span><i class="fas fa-exclamation-circle"></i></span>
            剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
          </p>
          <p class="ticketCard-price">
            TWD <span id="ticketCard-price">$${item.price}</span>
          </p>
        </div>
      </div>
    </li>
    `};

  if (regionSearch.value === "" || regionSearch.value === "地區搜尋") {
    filterData = data;
  } else {
    filterData = data.filter((item) => regionSearch.value === item.area);
  }

  if (filterData[0]) {
    filterData.forEach((item) => render(item));
  } else {
    cantFindArea.style.display = "block";
  }

  ticketCardAll.innerHTML = liStr;
  searchResult.textContent = `本次搜尋共 ${filterData.length} 筆資料`;
}

regionSearch.addEventListener("change", showSpots);

// for add new spot
function addSpot() {
  let alertText = '';

  if (!inputs[0].value) { alertText += "套票名稱請勿留空！<br>" };
  if (!inputs[1].value) { alertText += "圖片網址請勿留空！<br>" };
  if (!inputs[2].value) { alertText += "景點地區請擇一！<br>" };
  if (!inputs[3].value) { alertText += "套票金額請勿留空！<br>" };
  if (!inputs[4].value) { alertText += "套票組數請勿留空！<br>" };
  if (!inputs[5].value) { alertText += "套票星級請勿留空！<br>" };
  if (!inputs[6].value) { alertText += "套票描述請勿留空！<br>" };

  if (alertText) {
    showAlertText.innerHTML = alertText;
  } else {
    showAlertText.innerHTML = "";

    let obj = {
      "id": data.length,
      "name": inputs[0].value,
      "imgUrl": inputs[1].value,
      "area": inputs[2].value,
      "price": +inputs[3].value,
      "group": +inputs[4].value,
      "rate": +inputs[5].value,
      "description": inputs[6].value
    };
    data.push(obj);
    regionSearch.value = "";
    renderChart(objToArr(getAreaObj(data)));
    showSpots();
    addTicketForm.reset();
  }
}

addTicketBtn.addEventListener("click", addSpot);

// for rendering area summary chart
function getAreaObj(data) {
  let outputObj = {};
  data.forEach((item) => {
    if (item.area in outputObj) {
      outputObj[item.area]++;
    } else {
      outputObj[item.area] = 1;
    }
  })
  return outputObj;
}

function objToArr(obj) {
  let keys = Object.keys(obj);
  let outputArr = keys.map((key) => [key, obj[key]]);
  return outputArr;
}

function renderChart(areaArr) {
  const chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      columns: areaArr, // 資料存放
      type: 'donut',
    },
    donut: {
      title: "套票地區比重"
    },
    size: {
      height: 250
    }
  });
}
