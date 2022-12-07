let gElem = undefined, timer, isSearch = false;
function modalClick()
{
    const modal = document.querySelector(".header__modal"),
        button = document.getElementById("buttonAdd"),
        triangle = document.querySelector(".hm-triangle");

    let display = modal.style.display;
    if(display == '' || display == "none"){
        display = "block";
        button.style.background = "#C2E4FE";
    }
    else{
        display = "none";
        button.style.background = "#0271C7";
    }
    
    modal.style.display = display;
    triangle.style.display = display;
}

function createClick() {
    let event = document.getElementById("eventData");
    if(eventData.value.length > 0)
    {
        let split = eventData.value.split(","), array= [], buffer = "";
        for (let i = 0; i < split.length; i++) 
        {
            if(i == 0)
            {
                buffer = split[i];
                if(split[i].split(" ").length == 2){
                    buffer += " " + date.getFullYear();
                }

                array[i+1] = buffer;
                continue;
            }

            array[i+1] = split[i];
        }

        array[0] = getEventId(array[1]);
        array[4] = "";
        localStorage.setItem(array[1], array);
    }

    modalClick();
}

function modalClose(modal, elem) {
    let window = document.querySelector(modal);
    if(window != null)
        window.remove();

    if(elem != undefined)
        elem.style.boxShadow = "0 0 0 0";
}

function dayClick(elem) {
    modalClose(".calendar__modalcreate", gElem);
    modalClose(".calendar__modal", gElem);
    gElem = elem;

    elem.style.boxShadow =  "0px 0px 10px 2px #0271C7";
  
    const cElem = document.createElement('div');
    let childElem = document.createElement("img");
    childElem.src = "img/close.svg";
    cElem.append(childElem);

    let coord = elem.getBoundingClientRect().left-142;
    cElem.style.margin = "0 0 0 " + coord + "px";

    let h2 = elem.querySelector("h2");
    let split = h2.innerHTML.split(",");
    if(split[1] != undefined)
        split[0] = split[1].trim();

    if(getCreatedEvent(elem))
    {
        childElem.addEventListener('click', function(){
            modalClose(".calendar__modal", elem);
        });

        let buffer = localStorage.getItem(split[0] + " " + monthNames[date.getMonth()] + " " + date.getFullYear()),
            array = buffer.split(',');

        cElem.className = "calendar__modal";
        elem.closest('.calendar__week').append(cElem);

        childElem = document.createElement('h2');
        childElem.innerHTML  = array[2];
        cElem.append(childElem);

        childElem = document.createElement('div');
        childElem.className = "cm__date";
        childElem.innerHTML = split[0] + " " + monthNames[date.getMonth()];
        cElem.append(childElem);

        childElem = document.createElement('h3');
        childElem.innerHTML  = "Участники:";
        cElem.append(childElem);

        childElem = document.createElement('p');
        childElem.innerHTML  = array[3];
        cElem.append(childElem);

        childElem = document.createElement('textarea');
        childElem.placeholder = "Описание";
        childElem.type = "text";
        childElem.value = array[4];
        cElem.append(childElem);

        let mcButtons = document.createElement('div');
        mcButtons.className = "mc__buttons";
        cElem.append(mcButtons);
    
        childElem = document.createElement('button');
        childElem.innerHTML = "Готово";
        /*childElem.addEventListener('click', function(){
            readyClick(elem.id);
        });*/
        mcButtons.append(childElem);
    
        childElem = document.createElement('button');
        childElem.innerHTML = "Удалить";
        childElem.addEventListener('click', function(){
            deleteEvent(elem, split[0] + " " + monthNames[date.getMonth()] + " " + date.getFullYear());
        });
        mcButtons.append(childElem);
    }
    else
    {
        childElem.addEventListener('click', function(){
            modalClose(".calendar__modalcreate", elem);
        });

        cElem.className = "calendar__modalcreate";
        elem.closest('.calendar__week').append(cElem);
    
        childElem = document.createElement('input');
        childElem.placeholder = "Событие";
        childElem.type = "text";
        cElem.append(childElem);
    
        childElem = document.createElement('input');
        childElem.placeholder = "День, месяц, год";
    
        let month = date.getMonth();
        if(elem.id < 7 && split[0] > 9)
        {
            if(month == 0)
            {
                month = 11;
            }
            else
            {
                month -= 1;
            }
        }
        else if(elem.id > 30 && split[0] < 5)
        {
            if(month+1 == 12)
            {
                month = 0;
            }
            else
            {
                month += 1;
            }
        } 

        childElem.value = split[0] + ", " + monthNames[month] + ", " + date.getFullYear();
        childElem.type = "text";
        cElem.append(childElem);
    
        childElem = document.createElement('input');
        childElem.placeholder = "Имена участников";
        childElem.type = "text";
        cElem.append(childElem);
    
        childElem = document.createElement('textarea');
        childElem.placeholder = "Описание";
        childElem.type = "text";
        cElem.append(childElem);
    
        let mcButtons = document.createElement('div');
        mcButtons.className = "mc__buttons";
        cElem.append(mcButtons);
    
        childElem = document.createElement('button');
        childElem.innerHTML = "Готово";
        childElem.addEventListener('click', function(){
            readyClick(elem);
        });
        mcButtons.append(childElem);
    
        childElem = document.createElement('button');
        childElem.innerHTML = "Удалить";
        //childElem.onclick = deleteClick;
        mcButtons.append(childElem);
    }
}

//localStorage.clear();
function readyClick(elem) {
    const modal = document.querySelector(".calendar__modalcreate");
        
    let inputs = modal.querySelectorAll("input"),
        textarea = modal.querySelector("textarea");

    let inputDate = inputs[1].value.replace(new RegExp(',', 'g'), '');

    let event = [];
    event[0] = elem.id;
    event[1] = inputDate;
    event[2] = inputs[0].value;
    event[3] = inputs[2].value;
    event[4] = textarea.value;


    localStorage.setItem(inputDate, event);
    createEvent(String(event));
    modalClose(".calendar__modalcreate", elem);
}

function searchFieldClick() {
    if(!isSearch)
    {
        const modal = document.querySelector(".header__modalsearch");
        modal.style.display = "block";

        getEventsInSearchField();
        searchFieldCloseClick(1500);
    }
    else{
        searchFieldCloseClick(0);
        searchFieldDelTimer();
    }

    isSearch = !isSearch;
}

function searchFieldCloseClick(time) {
    timer = setTimeout(() => {
        const modal = document.querySelector(".header__modalsearch");
        modal.style.display = "none";
    
        const items = document.querySelectorAll(".hsmodal__item");
        for (let i = 0; i < items.length; i++) {
            items[i].remove();
        }
        isSearch = false;
    }, time);
}

function searchFieldDelTimer() {
    clearTimeout(timer);
    isSearch = false;
}

function updateClick() {
    clearEvents();
    getEvents();
}