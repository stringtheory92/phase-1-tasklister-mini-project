// For weather by city to function, need to source state codes for fetch url

document.addEventListener("DOMContentLoaded", () => {
  // your code here
  const form = document.querySelector("#create-task-form")
  const submitBtn = document.querySelector('#new-task-submit')
  const textField = document.querySelector("#new-task-description")
  const list = document.querySelector('#list');
  const weatherForm = document.querySelector('#weather-form');
  const cityInput = document.querySelector('#city-input');
  const citySubmit = document.querySelector('#city-submit');
  const weatherDisplay = document.querySelector('#weather-display')
  const currentWeatherDiv = document.querySelector('#current-weather')
  const weatherDetails = document.querySelector('#weather-details')
  const cityName = document.querySelector('#city-name')
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
        // for (location of data) {
        //   console.log(location)
        //   if (location.state === btn.id) 
        //     console.log(`You're in ${location.city}, ${location.state}`)
        // }
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
//getWeather('Maplewood');
//==============================================  
  // Click Submit Button and Handle Event



  // Handle Fns
  const handleSubmit = e => {
    e.preventDefault();
    console.log(textField.value)
    createTodo(textField.value);
    textField.value = '';
  }
  
  //submitBtn.addEventListener('click', handleSubmit)
  form.addEventListener('submit', handleSubmit)

  
  // Create li for tasks
  const createTodo = toDo => {
    
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button')
    
    li.className = 'todo-item'
    
    deleteBtn.addEventListener('click', e => {
      e.preventDefault();
      const parent = e.target.parentElement;
      parent.remove();
    })


    li.textContent = toDo;
    deleteBtn.textContent = 'X';
    li.appendChild(deleteBtn)
    list.appendChild(li)
  }

  // Append li to ul#tasks
  const appendTodo = toDo => {
    
  }

  













});
