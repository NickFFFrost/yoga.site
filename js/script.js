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



  //slide

  let slideIndex = 1,
      slides = document.querySelectorAll('.slider-item'),
      prev = document.querySelector('.prev'),
      next = document.querySelector('.next'),
      dotsWrap = document.querySelector('.slider-dots'),
      dots = document.querySelectorAll('.dot');
  
  let showSliders = (n) => {

    if (n > slides.length) {
      slideIndex = 1
    }
    if (n < 1) {
      slideIndex = slides.length
    }

    slides.forEach((item) => {
      item.style.display = "none"
    });

    dots.forEach((item) => {
      item.classList.remove("dot-active")
    });

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("dot-active");
  }
  showSliders(slideIndex);

  let plusSlides = (n) => {
    showSliders(slideIndex += n);
  }

  let currentSlides = (n) => {
    showSliders(slideIndex = n);
  }

  prev.addEventListener("click", () => {
    plusSlides(-1);
  });

  next.addEventListener("click", () => {
    plusSlides(1);
  });

  dotsWrap.addEventListener("click", () => {
    for (let i = 1; i < dots.length + 1; i++){
      if (event.target.classList.contains("dot") && event.target == dots[i - 1]) {
        currentSlides(i);
      }
    }
  });


  //calc

  let persons = document.querySelectorAll(".counter-block-input")[0],
      restDays = document.querySelectorAll(".counter-block-input")[1],
      place = document.getElementById("select"),
      totalValue = document.getElementById("total"),
      personsSum = 0,
      daysSum = 0,
      total = 0;
  
  totalValue.innerHTML = 0;

  persons.addEventListener("change", function() {

    personsSum = +this.value;
    total = (daysSum + personsSum) * 4000;

    if (restDays.value == "") {
      totalValue.innerHTML = 0;
    } else {
      totalValue.innerHTML = total;
    }

  })
  restDays.addEventListener("change", function() {

    daysSum = +this.value;
    total = (daysSum + personsSum) * 4000;

    if (persons.value == "") {
      totalValue.innerHTML = 0;
    } else {
      totalValue.innerHTML = total;
    }

  })

});
