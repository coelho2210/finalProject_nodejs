// getting the longitude and latitude - from our location
//after our page load we can get the location
window.addEventListener("load", () => {
    //define the coordinates
    let myLongitude;
    let myLatitude;
  
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimezone = document.querySelector(".location-timezone");
    let temperatureSection = document.querySelector(".temperature");
    const temperatureSpan = document.querySelector(".temperature span");
  
  
    // if this exist in our browser
    //then we can find he exact location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(myPosition => {
        // just testing if I am getting " my Position"
        console.log(myPosition);
  
        //getting the longitude position
        myLongitude = myPosition.coords.longitude;
        // getting the latitude position
        myLatitude = myPosition.coords.latitude;
  
        // this will aloow mw to do requests from my localserver
        // also that will fix the error "CORE"
        const proxy = "http://corsanywhere.herokuapp.com/";
  
        const api = `${proxy}https://api.darksky.net/forecast/ddca4b364fb02618ea1cde1227f8e9db/${myLatitude},${myLongitude}`;
  
        // getting informartion from the fallowing URL
        // adding api we afre fetching this thing with our own custom latitude
        // and longitude
        fetch(api)
          // my data will run just only we get it back
          .then(data => {
            //get the data and convert to JSON!
            return data.json();
          })
          .then(response => {
            console.log(response);
            // putting the code inside of the {} will allow me
            // to no use code as " data.currently.temperature"
            //I can just call the object that I am interestring for
            // putting inside of the {}
            const { temperature, summary, icon } = response.currently;
            //setting my elements from the APi
            temperatureDegree.textContent = temperature;
            temperatureDescription.textContent = summary;
            locationTimezone.textContent = response.timezone;
  
  
            //finding celsius
            let celsius = (temperature - 32) * (5 / 9);
  
            //setting the Icon
            //runnign the function adding the icon from html
            setIcons(icon, document.querySelector(".icon"));
  
  
  
            //changing temperature  F to Celsus
            temperatureSection.addEventListener('click', () => {
  
              if (temperatureSpan.textContent === "F") {
                temperatureSpan.textContent = "C";
                temperatureDegree.textContent = Math.floor(celsius);
  
              } else {
                temperatureSpan.textContent = "F";
                //temperatureDegree.textContent = temperature;
              }
            });
  
  
          });
  
      });
  
    }
    //if you have a problem with your browser
    else {
      h1.textContent = "You have a problem with your brower, that not support it";
    }
  
  
    //defining a function
    //adding a icon and icon ID as the documentation said
    // the id should match the html file
    function setIcons(icon, iconID) {
      const skycons = new Skycons({ color: "white" });
      // we replace whatever we got from the server with underscores and uppercase
      //because the API has the icon name separate by "-"" and the "icon.js"
      //has the name of the icon separate by "_", we need to change the "-" 
      const currentIcon = icon.replace(/-/g, "_").toUpperCase();
      //this will animate it (display the icon)
      skycons.play();
      return skycons.set(iconID, Skycons[currentIcon]);
    }
  
  
  });
  