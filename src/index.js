//import * as states from '../node_modules/us-state-converter'
//const states = require('us-state-converter')

//UPDATE 9/25: Fetch POST updates to db.json, but browser is refreshed so 
//displayed tasks are cleared. Need to implement a GET after the POST and 
//before the for loop/sorting. I think that will accomplish the goal.


// For weather by city to function, need to source state codes for fetch url
//Next to add: persist tasks to db.json and add priority sorting

  // fetch problem => fetch post refreshes browser, clearing tasks. it saves task to 
  // localhost:3000/tasks on the web, but not to db.json file in this directory. 

  // sort problem => sort code doesn't work. can isolate the first in a group of same priority
  // with querySelectorAll()[0], but can't get tasks.insertBefore() to work

  // city weather problem => need to write function to convert state to state code for weather 
  // endpoint query. Might need another fetch or even another api for this. 

document.addEventListener("DOMContentLoaded", () => {
  // your code here
  const form = document.querySelector("#create-task-form")
  const submitBtn = document.querySelector('#new-task-submit')
  const textField = document.querySelector("#new-task-description")
  const selectMenu = document.querySelector('#priority-menu')
  const list = document.querySelector('#list');
  const tasks = document.querySelector('#tasks')
  const weatherForm = document.querySelector('#weather-form');
  const cityInput = document.querySelector('#city-input');
  const citySubmit = document.querySelector('#city-submit');
  const weatherDisplay = document.querySelector('#weather-display')
  const currentWeatherDiv = document.querySelector('#current-weather')
  const weatherDetails = document.querySelector('#weather-details')
  const cityName = document.querySelector('#city-name')
  let tasksArray = [];
  let zip;

// ========== Day Stuff =============
  const getDay = () => {
    
    const date = new Date();
    const day = date.getDay()

    if (day === 0) return 'Sunday';
    if (day === 1) return 'Monday';
    if (day === 2) return 'Tuesday';
    if (day === 3) return 'Wednesday';
    if (day === 4) return 'Thursday';
    if (day === 5) return 'Friday';
    if (day === 6) return 'Saturday';

  }
  const postDay = (cb) => {
    const dayDiv = document.querySelector('#day')
    dayDiv.append(`Happy ${cb()}!`)
  }
  postDay(getDay)
//========================================

//=========== Weather Stuff ====================
const handleWeatherSubmit = e => {
  e.preventDefault();
//   const listOfStates = states.states()
// console.log(listOfStates)
  console.log(typeof cityInput.value, cityInput.value)
  console.log(typeof cityInput.value.match(/\d/g), cityInput.value.match(/\d/g))
  console.log(getWeatherByCity(cityInput.value));
  if (cityInput.value.match(/\d/g) === null) {
    getWeatherByCity(cityInput.value)
    .then(data => {
      console.log('data: ', data)
      if (data.length > 1) {
        const btnLabel = document.createElement('h3')
        btnLabel.textContent = 'Select City'
        weatherForm.append(btnLabel)
  
        const handleBtn = e => {
          e.preventDefault();
          console.log(btn.id)
        }
      //Creates state buttons with unique IDs and common class
        for (let location of data) {
          const btn = document.createElement('button');
          btn.id = location.state;
          btn.className = 'state-button';
          btn.textContent = location.state;
          weatherForm.append(btn)
          btn.addEventListener('click', e => {
            e.preventDefault();
            console.log(btn);
          //Get the weather for the location
          })
        }
      //Grabs all state buttons 
        const stateBtn = document.querySelector('.state-button')
      //Handle state button click
    }});
  } else {
    console.log('zip time!')
    getWeatherByZip(cityInput.value)
    .then(obj => {
      console.log(obj);
      console.log(obj.weather[0].description);
      const currentTemp = obj.main.temp;
      const feelsLike = obj.main.feels_like;
      const high = obj.main.temp_max;
      const low = obj.main.temp_min;
      const weather = obj.weather[0].description;
      const city = obj.name;
      
      cityName.textContent = `Your ${city} Weather:`
      currentWeatherDiv.textContent = `It's currently ${currentTemp.toFixed(0)}F with ${weather}.`;
      weatherDetails.textContent = `Feels like ${feelsLike.toFixed(0)}F
      with a high of ${high.toFixed(0)}F
      and a low of ${low.toFixed(0)}F`
    });
  }
}
weatherForm.addEventListener('submit', handleWeatherSubmit);

const getWeatherByCity = (city) => {
  const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`
    return fetch(apiByCity)
    .then(res => res.json())
    .then(data => data)
  }
const getWeatherByZip = (zip) => {
  const apiByZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`
  return fetch(apiByZip)
    .then(res => res.json())
    .then(data => data)
}
//==============================================  

//====== Task Lister ==============================

  // Submit Task functionality
  const handleSubmit = e => {
    e.preventDefault();
    
    tasksArray.push({name: textField.value, priority: selectMenu.value})
    tasksArray = sortByPriority(tasksArray);
    
    postTask(textField.value, selectMenu.value);

    tasks.innerHTML = ''; // Remove all li's from DOM
    
    for (let task of tasksArray) {
      createTodo(task.name, task.priority);
    }
    textField.value = '';
  }
  
  form.addEventListener('submit', handleSubmit)

  const postFetch = (url, configObj) => {
    return fetch(url, configObj)
    .then(res => res.json())
    .then(data => data)
  }

  const configObjMaker = (body) => {
    console.log('configObjMaker')
    
    return {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(body), 
    }
  }

  // Post task to server
  function postTask(task, priority) {
    console.log('postTask')
    
    postFetch('http://localhost:3000/tasks', configObjMaker({name: task, priority}))
    .then(res => res)
    .then(data => console.log(data))
    .catch(e => console.error('Problem posting: ', e))
  }

  // Create li for tasks
  const createTodo = (name, priority) => {
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button')

    li.textContent = name;
    deleteBtn.textContent = 'X';
    deleteBtn.id = 'delete-button';

    tasks.appendChild(li)
    li.appendChild(deleteBtn)
    
    deleteBtn.addEventListener('click', e => {
      e.preventDefault();
      const parent = e.target.parentElement;
      parent.remove();
    })
    
    if (priority === 'backburner') li.className = 'blue todo-item';
    if (priority === 'moderate') li.className = 'orange todo-item';
    if (priority === 'urgent') li.className = 'red todo-item';
  }
});
    //=================== PROBLEM CODE ===============================
        // postFetch('http://localhost:3000/tasks', configObjMaker({task: toDo, priority}))
        // .then(res => res)
        // .then(data => console.log(data))
        // .catch(e => console.error('Problem posting: ', e))
    //===============================================================
    
//=============================== PROBLEM CODE =====================================
    //sort and attach:
    //console.log(tasks.hasChildNodes(), priority)
    // if (!tasks.hasChildNodes()) console.log('first child')
    //  if (tasks.hasChildNodes()) {
      //  console.log('hi again', tasks)
      //   const blues = document.querySelector('.blue')
      //   console.log(li.className);
      //   console.log(document.querySelectorAll('.orange')[0]);
    //   const oranges = document.querySelector('#orange')
    //   const reds = document.querySelector('#red')
      // if (li.className === 'blue')  tasks.insertBefore(li, document.querySelectorAll('.orange')[0])
      // if (li.id === 'orange') tasks.insertBefore(li, document.querySelector('.red'))
      // if (li.id === 'red') reds.append(li)
      // }
//=================================================================================== 
 

function sortByPriority(tasksArray) {
  return tasksArray.sort((a, b) => {
    const nameA = a.priority.toUpperCase(); // ignore upper and lowercase
    const nameB = b.priority.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}