window.addEventListener('load', () => {
    let long;
    let lat;
    let bodyWrapper = document.querySelector('.body-wrapper');
    let tempDescription = document.querySelector('.temperature-description');
    let tempDegree = document.querySelector('.temperature-degree');
    let location = document.querySelector('.location');
    let tempSection = document.querySelector('.temperature');
    let tempSpan = document.querySelector('.temperature span');
    let currentDate = new Date();
    let currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`

    let weatherKey = config.weatherAPI_key;
    let geoKey = config.geoAPI_key;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //Proxy is only needed for local environment. Can be removed for active website.
            const proxy = `http://cors-anywhere.herokuapp.com/`;
            const api_weather = `${proxy}https://api.darksky.net/forecast/${weatherKey}/${lat},${long}`;
            const api_location = `https://api.ipgeolocation.io/ipgeo?apiKey=${geoKey}`;
            const api_astronomy = `https://api.ipgeolocation.io/astronomy?apiKey=${geoKey}`           
            
            fetch(api_weather)
                .then(response => {
                    return response.json();
                })
                .then(data =>{
                    const {temperature, summary, icon}= data.currently;
                    //Set DOM Elements from the API
                    tempDegree.textContent = temperature.toFixed(1);
                    tempDescription.textContent = summary;
                    //Temp Converter
                    let celcius = (temperature - 32) * (5/9);                   
                    //Set Icons
                    setIcons(icon, document.querySelector('.icon'));                    
                    //Change temp to Celcius
                    tempSection.addEventListener('click', () => {
                        if(tempSpan.textContent === "F") {
                            tempDegree.textContent = celcius.toFixed(1);
                            tempSpan.textContent = "C";
                        }else {
                            tempSpan.textContent = "F";
                            tempDegree.textContent = temperature.toFixed(1);
                        }
                    })
                });
                
                fetch(api_location)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {                    
                        location.innerHTML = `${data.city}, ${data.state_prov}`;
                    });

                fetch(api_astronomy)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        console.log(currentTime);
                        if(currentTime >= data.sunrise && currentTime < data.sunset) {
                            bodyWrapper.style.backgroundImage = 'linear-gradient(rgb(47,150,163), rgb(48,62,143))';
                        } else {
                            bodyWrapper.style.backgroundImage = `linear-gradient(rgb(10,10,75), rgb(0,0,35))`;
                        }
                        console.log(data);
                    })
            });
        }

        function setIcons(icon, iconID) {
            const skycons = new Skycons({color: "white"});
            const currentIcon = icon.replace(/-/g, "_").toUpperCase();
            skycons.play();
            return skycons.set(iconID, Skycons[currentIcon]);
        }
    });