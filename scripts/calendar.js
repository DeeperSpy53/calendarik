/*
 *      id
 *      ч м г
 *      событие
 *      участники
 *      описание
*/

const monthName = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
      monthNames = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ],
      todayDate = new Date(),
      date = new Date();

let title = document.querySelector("h2");
calendarClick();

function calendarClick(mode = 0){
    clearEvents();
    switch(mode){
        case 0: date.setMonth(todayDate.getMonth());    date.setFullYear(todayDate.getFullYear()); break;
        case 1:{
            let month = date.getMonth() + 1;
            if(month == 12)
            {
                month = 0;
                date.setFullYear(date.getFullYear()+1);
            }

            date.setMonth(month); 
            break;
        }
        case 2: date.setMonth(date.getMonth() - 1); break;
    }

    setCalendar(date.getMonth(), date.getFullYear());
}

function setCalendar(month, year){
    title.innerHTML = monthName[month] + " " + year;

    let dayWeek = new Date(year, month, 0).getDay(), id = 0, split;
    if(dayWeek > 0)
    {
        let monthPreDays = new Date(year, month, 0).getDate();
        for (let i = dayWeek-1; i >= 0; i--)
        {
            id = document.getElementById(i);
            id = id.querySelector("h2");
            split = id.innerHTML.split(",");

            if(split[0] != ''){
                id.innerHTML = split[0] + ", " + monthPreDays--;
            }
            else{
                id.innerHTML += ", " + monthPreDays--;
            }
        }
    }

    if(month == 11){
        month = 0;
    }
    else{
        month += 1;
    }

    let monthDays = new Date(year, month, 0).getDate(), day = 0;
    for (let i = dayWeek; i < 35; i++)
    {
        id = document.getElementById(i);
        id = id.querySelector("h2");
        if(i < 7){
            split = id.innerHTML.split(",");

            if(split[0] != ''){
                id.innerHTML = split[0] + ", " + Number(day+1);
            }
            else{
                id.innerHTML += ", " + Number(day+1);
            }
        }
        else
        {
            if(day >= monthDays){
                // Добавление чисел следующего месяца
                if(monthDays+dayWeek < 35)
                {
                    for(let j = 0; j < 35-(monthDays+dayWeek); j++){
                        id = document.getElementById(i+j);
                        id = id.querySelector("h2");
                        id.innerHTML = j+1;
                    }
                }
                break;
            }
            else
            {
                id.innerHTML = day+1;
            }
        }

        day++;
    }
    getEvents();
}

function clearEvents() {
    let month = date.getMonth(), buffer, array = [];

    for (let i = 1; i < new Date(date.getFullYear(), month+1, 0).getDate(); i++) {
        buffer = localStorage.getItem(i + " " + monthNames[date.getMonth()] + " " + date.getFullYear());
        if(buffer != null)
        {
            array = buffer.split(',');
            clearEvent(document.getElementById(array[0]));
        }
    }
}

function clearEvent(elem) {
    let buffer = elem.querySelector("h3");
    buffer.innerHTML = "";

    buffer = elem.querySelector("p");
    buffer.innerHTML = "";

    elem.style.background = "#fff";
}

function getEvents() {
    let month = date.getMonth(), buffer;

    for (let i = 1; i < new Date(date.getFullYear(), month+1, 0).getDate(); i++) {
        buffer = localStorage.getItem(i + " " + monthNames[date.getMonth()] + " " + date.getFullYear());

        if(buffer != null)
            createEvent(buffer);
    }
}

// Events
function createEvent(data) {
    let array = data.split(',');

    let elem = document.getElementById(array[0]);
    elem.style.background = "#C2E4FE";

    let buffer = elem.querySelector("h3");
    buffer.innerHTML = array[2];

    buffer = elem.querySelector("p");
    buffer.innerHTML = array[3];
}

function getCreatedEvent(elem) {
    if(elem.style.background == "rgb(194, 228, 254)")
        return true;

    return false;
}

function deleteEvent(elem, event) {
    localStorage.removeItem(event);
    modalClose(".calendar__modal", elem);
    clearEvent(elem);
}

// Search
function getEventsInSearchField() {
    let buffer, array, block;
    const elem = document.querySelector('.hsmodal__content');

    for (let i = 0; i < localStorage.length; i++) {
        buffer = localStorage.getItem(localStorage.key(i));
        array = buffer.split(',');
        
        block = document.createElement('div');
        block.className = "hsmodal__item";
        block.addEventListener('click', searchItem.bind(this, array[0], array[1]));
        elem.append(block);

        buffer = document.createElement('h2');
        buffer.innerHTML = array[2];  
        block.append(buffer); 

        buffer = document.createElement('p');
        buffer.innerHTML = array[1];  
        block.append(buffer); 
    }
}

function searchItem(id, event) {
    let buffer = event.split(" ");
    date.setMonth(monthNames.indexOf(buffer[1]));
    date.setFullYear(buffer[2]);

    setCalendar(date.getMonth(), date.getFullYear());

    dayClick(document.getElementById(id));
}

function getEventId(eventDate) {
    // 30 Ноября 2022
    let buffer = eventDate.split(" "),
        month = monthNames.indexOf(buffer[1]),
        year = buffer[2];

        
    let monthP = month, yearP = year;
    if(month == 11){
        monthP = 0;
        ++yearP;
    }
    else{
        monthP += 1;
    }

    let dayWeek = new Date(yearP, monthP, 0).getDay();
    if(dayWeek > 0)
    {
        let monthPreDays = new Date(year, month, 0).getDate();
        for (let i = dayWeek; i >= 0; i--)
        {
            if(buffer[0] == monthPreDays--)
                return i;
        }
    }

    dayWeek = new Date(year, month, 0).getDay()
    let monthDays = new Date(year, month, 0).getDate(), day = 0;
    for (let i = dayWeek; i < 35; i++)
    {
        if(i < 7){
            if(buffer[0] == day+1)
                return i;
        }
        else
        {
            /*if(day >= monthDays){
                if(monthDays+dayWeek < 35)
                {
                    for(let j = 0; j < 35-(monthDays+dayWeek); j++){
                        console.log(buffer[0] + " " + j+1);
                        if(buffer[0] == j+1)
                            return document.getElementById(i+j);
                    }
                }
                break;
            }*/

            if(buffer[0] == day+1)
                return day+1;
        }

        day++;
    }
}