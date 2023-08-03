// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"
import { collection, setDoc, doc, getDocs, addDoc, Timestamp, updateDoc,deleteField} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbyiewHyshcRadjps4bYrs1IhoDcyJPgM",
    authDomain: "sc2006-website.firebaseapp.com",
    databaseURL: "https://sc2006-website-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sc2006-website",
    storageBucket: "sc2006-website.appspot.com",
    messagingSenderId: "140548370620",
    appId: "1:140548370620:web:c2f845e99edb812c4e60b9",
    measurementId: "G-5GWV6T127Q"


  };




// Initialize Firebasec(database)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//To store references to three HTML elements in a web page with specific IDs.
const sportFilter = document.getElementById("sport-filter"); 
const locationFilter = document.getElementById("location-filter");
const weatherFilter = document.getElementById("weather-filter");
const resultElement = document.getElementById('result');



let sum; //To be used to capture the filtering options selected by user
let queryref = collection(db,"Gym_collection");
let q3; //To store query results from Firestore


//Array to store the filtered results
let sportFilArr = [];
let weaFilArray = [];
let filArray = [];
let flag;


//Event listener for filter button and reset the filter results as empty at the start
filterBtn.addEventListener("click", () => {
    sum=0;
    flag=0;
    sportFilArr = [];
    weaFilArray = [];
    locFilArr = [];
    filArray = [];
   
    getFilteredGyms(); //Function to start filtering process


});


// Store the current filter results
let currentFilters = {
    sports: [],
    location: false,
    weather: false,
};


let allArray = [];

const querySnapshot = await getDocs(collection(db, "Gym_collection"));
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const fName = doc.data().name;
    console.log(fName);
    allArray.push(fName);

});
const allArrayElement = document.getElementById('allArray');
allArrayElement.innerHTML = '<ul>' + allArray.map(item => `<li>${item}</li>`).join('') + '</ul>';






async function getFilteredGyms() {
 
    // Update the current filters based on the user input
    currentFilters.sports = Array.from(sportFilter.selectedOptions).map((option) => option.value);
    currentFilters.location = locationFilter.checked;
    currentFilters.weather = weatherFilter.checked;

    // var text = document.getElementById("loadingText");

    // text.style.display = "Loading...";

    // var text = document.getElementById("myText");
    // text.style.display = "block";
    allArrayElement.textContent = '';
    resultElement.textContent = "Loading... ...";


    if(currentFilters.sports.length <=0 && currentFilters.weather==false && currentFilters.location==false){

        resultElement.textContent = "Please choose a filter";

    }

    //To be used to capture the filtering options selected by user
    if(currentFilters.sports.length > 0){
        sum = sum + 1;
    }


    if(currentFilters.weather) {
        sum = sum + 2
    }


    if(currentFilters.location){
        sum = sum + 4
    }


    //Switch statement cases to cover all possible filtering options selected by user
    switch(sum) {
        case 1: //To filter sports facilities by Type of Sports
            console.log("filter: s " + currentFilters.sports);

            sFilter(currentFilters.sports);
            setTimeout(function(){    
                console.log("s array " , sportFilArr);
                //resultElement.textContent = "The result is: " + sportFilArr;
                resultElement.innerHTML = '<ul>' + sportFilArr.map(item => `<li>${item}</li>`).join('') + '</ul>';

            }, 550);
            break;


        case 2: //To filter sports facilities by Weather
            console.log("filter: w");
            wFilter();
            setTimeout(function(){  
                console.log("w array: " , weaFilArray);
                //resultElement.textContent = "The result is: "+  weaFilArray;
                resultElement.innerHTML = '<ul>' + weaFilArray.map(item => `<li>${item}</li>`).join('') + '</ul>';
            }, 6000);
            break;


        case 3: //To filter sports facilities by Type of Sports and Weather
            console.log("filter: s " + currentFilters.sports);
            console.log("filter: w");
            sFilter(currentFilters.sports);
            wFilter();
            setTimeout(function(){ //Find common sport facilities from the results of the 2 filtering
                console.log("s array: " , sportFilArr);
                console.log("w array: " , weaFilArray);
                twoArrayFilter(sportFilArr,weaFilArray);
            }, 7000);
            break;


        case 4: //To filter sports facilities by Live Location of user
            console.log("filter: l");
            Lfilter();
            setTimeout(function(){  
                console.log("l array: " , locFilArr);
                //resultElement.textContent = "The result is: " + locFilArr;
                resultElement.innerHTML = '<ul>' + locFilArr.map(item => `<li>${item}</li>`).join('') + '</ul>';
                }, 300);
            break;


        case 5: //To filter sports facilities by Type of Sports and Live Location of user
            console.log("filter: s " + currentFilters.sports);
            console.log("filter: l");
            sFilter(currentFilters.sports);
            Lfilter();
            setTimeout(function(){ //Find common sport facilities from the results of the 2 filtering
                console.log("s array: " , sportFilArr);
                console.log("l array: " , locFilArr);
                twoArrayFilter(sportFilArr,locFilArr);
            }, 500);
            break;


        case 6: //To filter sports facilities by Weather and Live Location of user
            console.log("filter: w");
            console.log("filter: l");
            wFilter();
            Lfilter();
            setTimeout(function(){ //Find common sport facilities from the results of the 2 filtering
                console.log("w array: " , weaFilArray);
                console.log("l array: " , locFilArr);
                twoArrayFilter(weaFilArray,locFilArr);
            }, 7000);
            break;


        case 7: //To filter sports facilities by Type of Sports, Weather and Live Location of user
            console.log("filter: s " + currentFilters.sports);
            console.log("filter: l");
            console.log("filter: w");
            sFilter(currentFilters.sports);
            Lfilter();
            wFilter();
            filArray = [sportFilArr,weaFilArray,locFilArr];
            setTimeout(function(){    
                console.log("s array: " , sportFilArr);
                console.log("l array: " , locFilArr);
                console.log("w array: " , weaFilArray);
                let result = filArray.reduce((sFilter, Lfilter) => sFilter.filter(wFilter => Lfilter.includes(wFilter)));
                console.log("result" , result);
                //resultElement.textContent = "The result is: " + result;
                resultElement.innerHTML = '<ul>' + result.map(item => `<li>${item}</li>`).join('') + '</ul>';
            }, 10000);


            break;
           
        default:
          // code block
         
      }


}

//let testEmail = "sanskkriti02@gmail.com";

// Create a query against the collection.
//const userRef = doc(db, 'Userlist', testEmail);

//Function to filter sports facilities by Type of Sports
function sFilter(sportsArray){

    //Creates a query object q3 that references a collection of documents in Firestore using the queryref variable.
    //The query function is used to apply a filter to the query by specifying that the sportsType field must contain any of the values in the sportsArray
    q3 = query(queryref, where('sportsType', 'array-contains-any', sportsArray));


        //The getDocs function is called on the q3 query object to retrieve the matching documents as a query snapshot.
        getDocs(q3)
        .then((querySnapshot) => {


            //The code then iterates over each document in the query snapshot using the forEach function and
            //extracts the data for each document using the data method.
            //In this case, the code retrieves the name field from each document and adds it to an array called sportFilArr.
            querySnapshot.forEach((doc) => {
            const data = doc.data();
            const fName = doc.data().name;
            sportFilArr.push(fName);
        });
        })


        //setDoc(userRef, {SportChosen: sportsArray }, { merge: true });
        
        
            

}




//The following code retrieves weather forecast data from an API, processes the data, and stores the relevant data in a Firestore collection.
function getWeather(){


    //Use the fetch function to make a request to the Data.gov.sg API and
    //Retrieve the weather forecast data for a specific date.
    //The API returns a promise that resolves to a response object.
    const weather = fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast') //2023-01-10
    .then(response => response.json()) //Use the response.json() method to extract the JSON data from the response object. This also returns a promise that resolves to the JSON data.
    .then(data => {
        return data.items[0]; //Extract the relevant data from the JSON data using dot notation and return the first item in the items array.
    });


    const saveWeather = async() => { //Declare an asynchronous function saveWeather that waits for the weather promise to resolve
        //and then extracts the forecast data for each of the 47 areas in the JSON data.
        const data = (await weather);
        for (let i = 0; i<47; i++) {
            const area = data.forecasts[i].area;
            const forecast = data.forecasts[i].forecast;
   
            //For each area in the forecast data, create a Firestore document reference using the doc method and the relevant collection name, document name, and area name.
            //This stores each Area name and its corresponding weather type in the database document
            const docOne = doc(db, "Weather_forecasts", area + " document"); //db, collectionName, documentName
            setDoc(docOne, {
                Area: area,
                Forecast: forecast }, { merge: true });
            }
    };
    saveWeather(); //Call the saveWeather function to store the forecast data in Firestore.


}


//This code uses the Firestore database service to filter out areas that are not experiencing rain, based on the weather forecast data stored in the Firestore collection.
function wFilter(){


    //Call the getWeather function to retrieve the weather forecast data and store it in the Firestore collection
    getWeather();
    //Declare a Firestore database reference to the Weather_forecasts collection using the collection method.
    const Weather_forecastRef = collection(db,"Weather_forecasts")
    //Create a Firestore query that filters the documents based on the Forecast field value, which contains the weather forecast data for each area.
    const q = query(Weather_forecastRef, where('Forecast', 'in', ['Partly Cloudy (Day)', 'Partly Cloudy (Night)', 'Cloudy', 'Partly Cloudy', 'Fair & Warm', 'Fair (Night)', 'Fair (Day)']));


    //Create an empty array areas to store the names of areas that are not experiencing rain
    let areas = []; //all areas option where its is not raining


    //Use the getDocs method to retrieve the documents that match the Firestore query
    getDocs(q)
    //Iterate over the documents using the querySnapshot.forEach method and extract the area name from each document.
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const area = data.Area;
            areas.push(area);//Push each area name into the areas array.
        });
       
        //Call the displayAreas function with the areas array as an argument
        setTimeout(() => {
            displayAreas(areas);
        }, 5000);
       
        })


        .catch((error) => {
        console.log("Error getting documents: ", error);
        });




        //After getting all areas that are not raining,
        //the function finds out the sports facilities located at those areas that are not raining
        //which will be the result of the filtering
        function displayAreas(areas) {


            let count;
            if(areas.length%9==0){
                count= (areas.length/9);
            }
            else{
                count= ((areas.length-areas.length%9)/9)+1;
            }
           


            for (let i = 0; i<count*9; i+=9) {
                let k=i+9;
                const slicedArray = areas.slice(i,i+9); //for all areas where its is not raining, can only displayed up to 8 locations if users choose all areas that are not raining
   
                const Gym_collectionRef = collection(db,"Gym_collection")


                if(slicedArray.length == 0){
                    console.log("All areas are raining today!")
                } else{
                    const q2 = query(Gym_collectionRef, where('area', 'in', slicedArray));
                   
                    getDocs(q2)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const fName = data.name;
                        weaFilArray.push(fName);
                        });
                    })
                    .catch((error) => {
                    console.log("Error getting documents: ", error);
                    });
                }
            }


           
        }
   
}


// Declare global variables to be used in location filter
let dataLong;
let dataLat;
let userLat;
let userLong;
var locFilArr = []


//This code uses the Firestore database service to filter out sports facilities that are within 10km of the user's live location


function Lfilter(){

    // const mapElement = document.getElementById('map');
    // mapElement.textContent = "Map";
    // Define the getPosition function to get user's geolocation
    var map;
    function getPosition() {

        //map
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var latlng = new google.maps.LatLng(latitude, longitude);
                console.log(latlng);

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            document.getElementById('location').innerHTML = results[0].formatted_address;
                            document.getElementById('location').innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude + "<br>" + results[0].formatted_address;

                            map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 12,
                                center: latlng
                            });

                            var marker = new google.maps.Marker({
                                position: latlng,
                                map: map
                            });
                        } else {
                            document.getElementById('location').innerHTML = 'No results found';
                        }
                    } else {
                        document.getElementById('location').innerHTML = 'Geocoder failed due to: ' + status;
                    }
                });
            }, function() {
                document.getElementById('location').innerHTML = 'Unable to retrieve your location';
            });
        } else {
            document.getElementById('location').innerHTML = 'Geolocation is not supported by your browser';
        }


        //location filter
        return new Promise(function(resolve, reject) {


          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              userLat = position.coords.latitude; //Store user's latitude
              userLong = position.coords.longitude; //Store user's longitude

              resolve();
            }, function(error) {
              reject(error);
            });
          } else {
            reject("Geolocation is not supported by this browser.");
          }
        });
      }
     
      //Call the getPosition function to get user's geolocation
      getPosition().then(async function() {


        // Get the sport facilities data from Gym_collection Firestore
        const querySnapshot = await getDocs(collection(db,"Gym_collection"));


        //Loop through the all the sport facilities data from Gym_collection Firestore
        querySnapshot.forEach(doc=>{
            dataLong = doc.data().longtitude; //Store longitude
            dataLat = doc.data().latitude; //Store latitude


            const toRadians = (angle) => angle * (Math.PI / 180);


            // Convert latitudes and longitudes to radians
            const lat1Rad = toRadians(userLat);
            const lon1Rad = toRadians(userLong);
            const lat2Rad = toRadians(dataLat);
            const lon2Rad = toRadians(dataLong);


            // Calculate the differences between the latitudes and longitudes of database data and user data
            const dLat = lat2Rad - lat1Rad;
            const dLon = lon2Rad - lon1Rad;


            // Apply the Haversine formula
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


            // Earth's mean radius in kilometers (approximately 6,371 km)
            const R = 6371;


            // Calculate and store the sports facilities data if it's within 10km of the users live location
            const distance = R * c;
           
            if(distance<10){
                locFilArr.push(doc.data().name);
            }


    });
        }).catch(function(error) {
            console.error(error);
        });


}




function twoArrayFilter(arrayOne, arrayTwo){
   
    filArray=[]; //"filArray" that will hold the filtered values

    //Use a nested loop to iterate through the elements of both arrays and compare their values,
    //to find common sport facilities
    //If an element of arrayOne matches an element of arrayTwo, push the matching element to the "filArray"
    //This will be the result from 2 or more filtering options
    for(let j = 0; j<arrayOne.length;j++ ){
        for(let i = 0;i<arrayTwo.length;i++){
            if(arrayOne[j]===arrayTwo[i]){  
                filArray.push(arrayOne[j]);
                const resultElement = document.getElementById('result');
                //resultElement.textContent = "The result is: " + filArray;
                resultElement.innerHTML = '<ul>' + filArray.map(item => `<li>${item}</li>`).join('') + '</ul>';
            }
        }
    }
   
}

