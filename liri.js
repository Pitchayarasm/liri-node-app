var dotenv = require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");
var fs = require("fs");
var userInput;

inquirer.prompt([{
    type : "list",
    message : "Please choose one of the following choices..",
    choices : ["concert-this","spotify-this-song","movie-this","do-what-it-says"],
    name : "input"
}])
.then(function(res){
    userInput = res.input;
    switch(userInput) {
        case "concert-this":
        concert();
        break;

        case "spotify-this-song":
        songs();
        break;
        
        case "movie-this":
        movies();
        break;

        case "do-what-it-says":
        what();
        break;
    }
})

function concert() {
    inquirer.prompt([{
        type : "input",
        message : "Please input your favorite Artist/Band here..",
        name : "band"
    }])
    .then(function(res){
        let bands = res.band;
        axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp")
        .then(function(data){
            let info = data.data;
            if ( info.length === 0) {
                console.log("Sorry, there is no upcoming concerts were found for that artist/band.");
            } else if (info.errorMessage === "[NotFound] The artist was not found") {
                console.log("Sorry, there is no information were found for that artist/band.");
            } else {
                for(let i = 0; i < info.length; i++) {
                    var date = info[i].datetime;
                    console.log("Venue Name : " + info[i].venue.name);
                    console.log("Venue Location : " + info[i].venue.city + ", " + info[i].venue.country);
                    console.log("Date of the Event : " + moment(date).format("MM/DD/YYYY"))
                    console.log("====================================================================================================================================");
                }
            }
        })
        .catch((error) => {
            if (error) {
                console.log("Sorry, Artist/Band not found");
            }
        });
    })
}

function songs() {
    inquirer.prompt([{
        type : "input",
        message : "Please input your favorite song here..",
        name : "song"
    }])
    .then(function(res){
        let song = res.song;
        if ( song > 1) {
            spotify.search({ type: "track", query : song }, function (err, data) {
                let songInfo = data.tracks.items;
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                } else if ( songInfo === undefined ) {
                    console.log("Sorry, song not found..")
                } else {
                    for (var i = 0; i < songInfo.length; i++) {
                        let artistsList = songInfo[i].artists
                        for (var j = 0 ; j < artistsList.length ; j++ ) {
                            console.log("Artist(s) : " + artistsList[j].name);
                            console.log("Song Name : " + songInfo[i].name);
                            if ( songInfo[i].preview_url === null ) {
                                console.log("Preview Link : unavilable");
                            } else {
                                console.log("Preview Link : " + songInfo[i].preview_url);
                            }
                            console.log("Album : " + songInfo[i].album.name);
                            console.log("=========================================================================================================================================");
                        }
                    }
                }
            });
        } else {
            spotify.search({ type: "track", query : "The Sign Ace of Base" }, function (err, data) {
                let songInfo = data.tracks.items;
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                } else {
                    let artistsList = songInfo[0].artists
                        console.log("Artist(s) : " + artistsList[0].name);
                        console.log("Song Name : " + songInfo[0].name);
                        if ( songInfo[0].preview_url === null ) {
                        console.log("Preview Link : unavilable");
                        } else {
                        console.log("Preview Link : " + songInfo[0].preview_url);
                        }
                        console.log("Album : " + songInfo[0].album.name);
                        console.log("====================================================================================================================================");
                }
            });
        }
    });
};

function movies() {
    inquirer.prompt([{
        type : "input",
        message : "Please input your favorite movie here..",
        name : "movie"
    }])
    .then(function(res){
        let movie = res.movie
            if (!movie) {
        	    movie = "Mr. Nobody";
            } 
        axios.get("http://www.omdbapi.com/?apikey=25066493&t=" + movie )
        .then(function(data) {
            if ( data.data.Title === undefined ) {
                console.log("Sorry, movie not found!")
            } else {
                console.log("Title : " + data.data.Title);
                console.log("Year : " + data.data.Year);
                console.log("IMDB Rating : " + data.data.imdbRating);
                if ( data.data.Ratings.length < 2 ) {
                    console.log("Rotten Tomatoes Rating : unavailable");
                } else {
                    console.log("Rotten Tomatoes Rating : " + data.data.Ratings[1].Value);
                }
                console.log("Country : " + data.data.Country);
                console.log("Language : " + data.data.Language);
                console.log("Plot : " + data.data.Plot);
                console.log("Actors : " + data.data.Actors);
                console.log("=========================================================================================================================================");
                }
        })
    });
}

function what() {
    fs.readFile("random.txt","utf8",function(err,res){
        if (err) {
            console.log(err);
            return;
        } else {
            
        }
    })
}