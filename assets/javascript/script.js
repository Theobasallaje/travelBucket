console.log(`authentication.js`);
// Initialize Firebase
let config = {
    apiKey: "AIzaSyAxo99bTFF_0XP1DGxnrTQ7Inb-AnomzXY",
    authDomain: "travel-bucket-b4124.firebaseapp.com",
    databaseURL: "https://travel-bucket-b4124.firebaseio.com",
    projectId: "travel-bucket-b4124",
    storageBucket: "travel-bucket-b4124.appspot.com",
    messagingSenderId: "581651439536"
}

firebase.initializeApp(config);

let auth = firebase.auth();
let database = firebase.database();
//TODO push user states into the array below from firebase

//Anh's Map Logic
var markers = [];
var map;
var bounds = new google.maps.LatLngBounds();
var infowindow = new google.maps.InfoWindow();
var loggedinUser;
var currPlace = {
    name: '',
    location: ''
}

document.getElementById('map').style.visibility = 'hidden';

function placeMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });
    map.setZoom(10);
    map.panTo(marker.position);
    markers.push(marker);

}

function initAutocomplete() {

    // initialize the global map variable 
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22, lng: 11 },
        zoom: 2,
        minZoom: 1,
        panControl: false,
        mapTypeId: 'roadmap'
    });

    var input = document.getElementById("place");
    var searchBox = new google.maps.places.SearchBox(input);


    var icon = {
        url: 'https://www.redfin.com/blog/wp-content/uploads/2015/02/icon_HouseHeart_red_750x5002.png', // url
        scaledSize: new google.maps.Size(45, 45), // scaled size
    };
    var marker;

    google.maps.event.addListener(searchBox, 'places_changed', function () {
        // document.getElementById('place').value = '';
        document.getElementById('label').setAttribute("class", "style1");
        var places = searchBox.getPlaces();
        // name = places[0].name;
        document.getElementById('destName').innerHTML = name;
        var city = document.getElementById('destName').innerHTML;
        currPlace.name = places[0].name;
        currPlace.location = places[0].geometry.location;

    });



}

google.maps.event.addDomListener(window, "load", initAutocomplete);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Theo's List Logic
//global variables 
var placeCount = 0;
var details = $("#details");
var isDelete = false;
// var place;
var placesArray = [];

//functions
function displayCurrentWeather(place, id) {

    // var place = $(this).attr("data-name");
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + place + "&APPID=4a0a593fadc57ad8bdb83a0a5340005c";

    // Creates AJAX call for the specific movie button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Retrieves the Rating Data for temp
        var currentWeather = response.main.temp;
        // Displays the rating
        details.append(`<div> ${place}: ${temperatureConversion(currentWeather)}<div>`);
        // details.append(`<div class='${id}'> ${place}: ${temperatureConversion(currentWeather)}<div>`); //remove details when removing list item
    });

}

let temperatureConversion = (currentWeather) => {
    var kelvin = currentWeather
    var clesius = kelvin - 273;
    var fahrenheit = Math.round(clesius * (9 / 5) + 32);
    return fahrenheit;
}

//listener for login state
auth.onAuthStateChanged(function (user) {
    alert('onAuth');
    // for (var i = 0; i < placesArray.length; i++) {
    //     $("#places").append(paragraph);
    // }
    loggedinUser = user;
    //store input location from user

});

// database.ref(`/${userUid}`).on('child_added', function (snap) {
//     place = snap.val();
//     console.log(place);
// });

//click events
$("#add-place").on("click", function (event) {
    isDelete = false;
    event.preventDefault();
    //var place = $("#place").val().trim();
    // $.each(names, function(i, el){
    //     if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    // });
    // console.log(placesArray);

    var paragraph = $("<p>");
    //paragraph.attr("data-cityId", "item-" + placeCount);
    var span = $("<span>");
    span.attr("data-cityid", "city-" + placeCount);
    span.addClass("placeText");
    paragraph.addClass("city-" + placeCount);

    let place = $("#place").val().trim();
    //user is signed in
    if (loggedinUser) {



        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&units=imperial&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {

                document.getElementById('destTemp').innerHTML = ("Current Temperature: " + response.main.temp);
            });
        document.getElementById('info').style.visibility = 'visible';
        placeMarker(currPlace.location);
        document.getElementById('map').style.visibility = 'visible';



        let userUid = loggedinUser.uid;
        //listener for value changes in firebase
        database.ref(`/${userUid}`).on('value', function (snap) {
            console.log({isDelete});
            if (!isDelete) {
                placesArray = snap.val().places;
                console.log(placesArray);
                console.log(typeof placesArray);
                //only update array for user to firebase if user added a new item
                console.log({ isDelete });
                if (!placesArray.includes(place)) {
                    console.log({ isDelete });
                    placesArray.push(place);
                    database.ref(`/${userUid}`).update({ "places": placesArray });
                    // if (isDelete = false) {
                    //     console.log({isDelete});
                    //     placesArray.push(place);
                    //     database.ref(`/${userUid}`).update({ "places": placesArray });
                    // }
                    console.log(placesArray[i]);
                    for (var i = 0; i < placesArray.length; i++) {
                        $("#places").append(paragraph);
                        console.log(paragraph);
                    }
                }
                $("#place").val("");
                for (var i = 0; i < placesArray.length; i++) {
                    if (placesArray[i] === "") {
                        placesArray.splice(i, 1);
                    }
                }
            }
            console.log(placesArray);
        });

    } else {
        // alert('Please sign in');
        //user is not signed in
        //clear local storage
        localStorage.clear();
        //Within local storage, push the place to the array if it is not already listed
        if (!placesArray.includes(place)) {
            placesArray.push(place);
            localStorage.setItem("places", JSON.stringify(placesArray));
            $("#place").val("");
        }
    }



    span.text(place);
    paragraph.addClass("listItem")

    var button = $("<button>");
    button.attr("data-cityid", placeCount);
    button.addClass("checkbox");
    button.addClass("btn btn-danger");
    button.append('<i class="fas fa-trash-alt"></i>');

    paragraph = paragraph.prepend(button);
    paragraph.append(span);


    // for(var i=0; i<placesArray; i++){
    //     if (place === placesArray[i]){
    //         console.log({place})
    //         $("#places").append(paragraph);
    //     }
    //     else {
    //         alert("Place already showing");
    //     }
    // }


    // $("#places").val("");

    placeCount++;
});

$(document.body).on("click", ".checkbox", function () {

    isDelete = true;

    let userUid = loggedinUser.uid;

    var blockId = $(this).attr("data-cityid");
    console.log(placesArray);

    var placeNumber = $(this).attr("data-place");

    $(".city-" + blockId).remove();

    let placeToRemove = $(this).parent().find('.placeText').text();
    var index = placesArray.indexOf(placeToRemove);
    if (index !== -1) placesArray.splice(index, 1);
    placesArray.splice(0, 0, "");
    database.ref(`/${userUid}`).update({ "places": placesArray });
    // placesArray.pop($(".item-" + placeNumber));
    // $(`#${place.value}`).empty();

    console.log(placesArray);
    console.log(index);
    console.log({ placeToRemove });

});

// isDelete = false;

// $(".listItem").on("click", function(){
//     place = $(this).val().trim();
//     console.log(place);
//     console.log("in listItem click event");
//     // displayCurrentWeather(place);

// });

$(document).on("click", ".placeText", function () {
    var place = $(this).text();
    var blockId = $(this).attr("data-cityid");
    console.log({ place });
    displayCurrentWeather(place, blockId);

});

// $(document).on("click", ".listItem", displayCurrentWeather)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Adrians's Firebase Logic


$('#register-btn').on('click', function (e) {
    //TODO Collect First Name and Last name information as a part of registration
    //TODO Add CSS to change color of fields if pw does not match
    //TODO Add validation to email if formatted incorrectly

    e.preventDefault();
    //store values from registration from
    let fName = $('#fname-reg').val().trim();
    let lName = $('#lname-reg').val().trim();
    let email = $('#email-reg').val().trim();
    let password = $('#pw-reg').val().trim();
    let confirmPassword = $('#pw-reg-confirm').val().trim();
    console.log(`email: ${email}, pw: ${password}, confirm pw: ${confirmPassword}`);
    if (password === confirmPassword) {
        //create account in firebase if password and password confirmation match
        auth.createUserWithEmailAndPassword(email, password)

            .then(function () {
                //store current user unique ID
                let userUid = firebase.auth().currentUser.uid;
                console.log(userUid);
                placesArray = JSON.parse(localStorage.getItem('places'));
                //create directory in firebase
                database.ref(`/${userUid}`).set({
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    places: placesArray
                });
                alert(`Registration successful`);
            })

            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(`${errorCode}: ${errorMessage}`);
                alert(errorMessage);
            });

        //empty input values
        $('#email-reg').val('');
        $('#pw-reg').val('');
        $('#pw-reg-confirm').val('');

    } else {
        //empty input values if passwords do not match and alert the user
        alert('Passwords do not match!');
        $('#pw-reg').val('')
        $('#pw-reg-confirm').val('')
        console.log('Passwords do not match!');
    }

});

$('#login-btn').on('click', function (e) {
    e.preventDefault();
    //collect values from sign in form
    let email = $('#email-login').val().trim();
    let password = $('#pw-login').val().trim();

    console.log(`email: ${email}, password: ${password}`)
    //validate credentials via firebase
    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            //store current user unique ID
            alert(`Login Successful`);
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            console.log(`error code: ${errorCode}, error message: ${errorMessage}`);
        })

});

//allow the user to logout on click
$('#logout').on('click', function () {
    auth.signOut()
        .then(function () {
            //clear all form values
            $('.clear-field').val('');
            alert('Log out successful');
        }).catch(function (error) {
            console.log(error);
        });
});

/*
If the user is not logged, save their locations in local storage
Retrieve data from their firebase account and display it on bucket list for signed in user
If the user is logged in, allow user to add locations to the list of places associated with their account
While user is signed in, the the user removes item from bucket list, remove from firebase
*/

//TODO test what happens if a user registers but never searches a location before hand.