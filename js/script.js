window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  let tab = document.querySelectorAll(".info-header-tab"),
      info = document.querySelector(".info-header"),
      tabContent = document.querySelectorAll(".info-tabcontent");

  let hideTabContent = (a) => {
    for (let i = a; i < tabContent.length; i++ ) {
      tabContent[i].classList.remove("show");
      tabContent[i].classList.add("hide");
    }
  }
  hideTabContent(1);

  let showTabContent = (b) => {
    if (tabContent[b].classList.contains("hide")) {
      tabContent[b].classList.remove("hide");
      tabContent[b].classList.add("show");
    }
  }

  info.addEventListener("click", (event) => {
    let target = event.target;
    if (target && target.classList.contains("info-header-tab")) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }

  });


// timer

let deadline = "2019-09-12";

let getTimeRemaining = (endtime) => {
  const t = Date.parse(endtime) - Date.parse(new Date()),
      seconds = Math.floor( (t / 1000) % 60 ),
      minutes = Math.floor( (t / 1000 / 60) % 60 ),
      hours = Math.floor( (t / (1000 * 60 * 60)) );

      return {
        "total" : t,
        "hours" : hours,
        "minutes" : minutes,
        "seconds" : seconds
      };
};

const setClock = (id, endtime) => {
  let timer = document.getElementById(id),
      hours = timer.querySelector(".hours"),
      minutes = timer.querySelector(".minutes"),
      seconds = timer.querySelector(".seconds");

  const updateClock = () =>{
    let t = getTimeRemaining(endtime),
        valueHours = t.hours.toString(),
        valueMinutes = t.minutes.toString(),
        valueSeconds = t.seconds.toString();
        
        hours.textContent = t.hours;
        minutes.textContent = t.minutes;
        seconds.textContent = t.seconds;

    if (t.total <= 0 && t.hours <= 0 && t.minutes <= 0 && t.seconds <= 0) {
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";
      clearInterval(timeInterval);
      let massage = document.querySelector(".timer-action");
      massage.textContent = "Акция закончилась";
    } 

    if (valueHours.length < 2) {
      hours.textContent = "0" + valueHours;
    } else if (valueMinutes.length < 2) {
      minutes.textContent = "0" + valueMinutes;
    } else if (valueSeconds.length < 2) {
      seconds.textContent = "0" + valueSeconds;
    }
  };
  let timeInterval = setInterval(updateClock, 1000);
};

setClock ("timer", deadline);



//modal

let overlay = document.querySelector(".overlay"),
    isActiveBtn;

let bindModal = (overlayStatus,overflowStatus,classListMethod,element) => {
  if (classListMethod == "add") {
    isActiveBtn = element;
  }
  if (!element) {
    element = isActiveBtn;
  }
  overlay.style.display = overlayStatus;
  element.classList[classListMethod]("more-splash");
  document.body.style.overflow = overflowStatus;
}

document.addEventListener("click", event => {
  let target = event.target;

  if ( target.classList.contains("description-btn") || target.classList.contains("more") ) {
    bindModal("block", "hidden", "add", target);
  }
  
  if ( target.classList.contains("popup-close") ) {
    bindModal("none", "", "remove");
  }

});


// Form

  let message = {
    loading: "Загрузка...",
    success: "Спасибо! Мы скоро с вами свяжемся!",
    failure: "Что-то пошло не так..."
  };

  let statusMessage = document.createElement("div");
      
      statusMessage.classList.add("status");
  
  let formSend = (element) =>{
      element.appendChild(statusMessage);
  
      let request = new XMLHttpRequest();
      request.open("POST", "server.php");
      request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  
      let formData = new FormData(element);
  
      let obj = {};
        formData.forEach((value,key) => {
          obj[key] = value;
        });
  
      let json = JSON.stringify(obj);
  
      request.send(json);
  
      request.addEventListener("readystatechange", () => {
        if (request.readyState < 4) {
          statusMessage.innerHTML = message.loading
        } else if (request.readyState === 4 && request.status == 200) {
          statusMessage.innerHTML = message.success;
        } else {
          statusMessage.innerHTML = message.failure;
        }
      })
  
      for (let i = 0; i < element.length; i++) {
        element[i].value = "";
      }

  };


  document.addEventListener("submit", (event) => {
    event.preventDefault();
    formSend(event.target);
  });


  document.body.addEventListener("input", event => {

    if (event.target.getAttribute("type") === "tel") {
      event.target.value = "+" + event.target.value.replace(/[^0-9]/g, "").slice(0, 11);
      if (event.target.value.length == 1) {
        event.target.value = "";
      }
    }

  });

});