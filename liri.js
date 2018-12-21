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

function concert(input) {
    if (!input) { 
        inquirer.prompt([{
            type : "input",
            message : "Please input your favorite Artist/Band here..",
            name : "band"
        }])
        .then(function(res){
            var bands = res.band;
            axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp")
            .then(function(data){
                let info = data.data;
                if ( info.length === 0) {
                    save("Sorry, there is no upcoming concerts were found for that artist/band.");
                } else if (info.errorMessage === "[NotFound] The artist was not found") {
                    save("Sorry, there is no information were found for that artist/band.");
                } else {
                    for(let i = 0; i < info.length; i++) {
                        var date = info[i].datetime;
                        save("Venue Name : " + info[i].venue.name);
                        save("Venue Location : " + info[i].venue.city + ", " + info[i].venue.country);
                        save("Date of the Event : " + moment(date).format("MM/DD/YYYY"))
                        save("==============================================================================================");
                    }
                }
            })
            .catch((error) => {
                if (error) {
                    save("Sorry, Artist/Band not found");
                }
            });
        });
    } else {
        bands = input;
        axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp")
        .then(function(data){
            let info = data.data;
            if ( info.length === 0) {
                save("Sorry, there is no upcoming concerts were found for that artist/band.");
            } else if (info.errorMessage === "[NotFound] The artist was not found") {
                save("Sorry, there is no information were found for that artist/band.");
            } else {
                for(let i = 0; i < info.length; i++) {
                    var date = info[i].datetime;
                    save("Venue Name : " + info[i].venue.name);
                    save("Venue Location : " + info[i].venue.city + ", " + info[i].venue.country);
                    save("Date of the Event : " + moment(date).format("MM/DD/YYYY"))
                    save("==============================================================================================");
                }
            }
        })
        .catch((error) => {
            if (error) {
                save("Sorry, Artist/Band not found");
            }
        });
    }
}

function songs(input) {
    if (!input) {
        inquirer.prompt([{
            type : "input",
            message : "Please input your favorite song here..",
            name : "song"
        }])
        .then(function(res){
            var song = res.song;
            if ( song !== "") {
                spotify.search({ type: "track", query : song }, function (err, data) {
                    let songInfo = data.tracks.items;
                    if (err) {
                        console.log("Error occurred: " + err);
                        return;
                    } else if ( songInfo === undefined ) {
                        save("Sorry, song not found..")
                    } else {
                        for (var i = 0; i < songInfo.length; i++) {
                            let artistsList = songInfo[i].artists
                            for (var j = 0 ; j < artistsList.length ; j++ ) {
                                save("Artist(s) : " + artistsList[j].name);
                                save("Song Name : " + songInfo[i].name);
                                if ( songInfo[i].preview_url === null ) {
                                    save("Preview Link : unavilable");
                                } else {
                                    save("Preview Link : " + songInfo[i].preview_url);
                                }
                                save("Album : " + songInfo[i].album.name);
                                save("==============================================================================================");
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
                            save("Artist(s) : " + artistsList[0].name);
                            save("Song Name : " + songInfo[0].name);
                            if ( songInfo[0].preview_url === null ) {
                            save("Preview Link : unavilable");
                            } else {
                            save("Preview Link : " + songInfo[0].preview_url);
                            }
                            save("Album : " + songInfo[0].album.name);
                            save("==============================================================================================");
                    }
                });
            }
        });
    } else {
        var song = input;
        spotify.search({ type: "track", query : song }, function (err, data) {
            let songInfo = data.tracks.items;
            if (err) {
                console.log("Error occurred: " + err);
                return;
            } else if ( songInfo === undefined ) {
                save("Sorry, song not found..")
            } else {
                for (var i = 0; i < songInfo.length; i++) {
                    let artistsList = songInfo[i].artists
                    for (var j = 0 ; j < artistsList.length ; j++ ) {
                        save("Artist(s) : " + artistsList[j].name);
                        save("Song Name : " + songInfo[i].name);
                        if ( songInfo[i].preview_url === null ) {
                            save("Preview Link : unavilable");
                        } else {
                            save("Preview Link : " + songInfo[i].preview_url);
                        }
                        save("Album : " + songInfo[i].album.name);
                        save("==============================================================================================");
                    }
                }
            }
        });
    }
};

function movies(input) {
    if (!input) {
        inquirer.prompt([{
            type : "input",
            message : "Please input your favorite movie here..",
            name : "movie"
        }])
        .then(function(res){
            var movie = res.movie
                if (!movie) {
                    movie = "Mr. Nobody";
                } 
            axios.get("http://www.omdbapi.com/?apikey=25066493&t=" + movie )
            .then(function(data) {
                if ( data.data.Title === undefined ) {
                    save("Sorry, movie not found!")
                } else {
                    save("Title : " + data.data.Title);
                    save("Year : " + data.data.Year);
                    save("IMDB Rating : " + data.data.imdbRating);
                    if ( data.data.Ratings.length < 2 ) {
                        save("Rotten Tomatoes Rating : unavailable");
                    } else {
                        save("Rotten Tomatoes Rating : " + data.data.Ratings[1].Value);
                    }
                    save("Country : " + data.data.Country);
                    save("Language : " + data.data.Language);
                    save("Plot : " + data.data.Plot);
                    save("Actors : " + data.data.Actors);
                    save("==============================================================================================");
                }
            })
        });
    } else {
        movie = input;
        axios.get("http://www.omdbapi.com/?apikey=25066493&t=" + movie )
        .then(function(data) {
            if ( data.data.Title === undefined ) {
                save("Sorry, movie not found!")
            } else {
                save("Title : " + data.data.Title);
                save("Year : " + data.data.Year);
                save("IMDB Rating : " + data.data.imdbRating);
                if ( data.data.Ratings.length < 2 ) {
                    save("Rotten Tomatoes Rating : unavailable");
                } else {
                    save("Rotten Tomatoes Rating : " + data.data.Ratings[1].Value);
                }
                save("Country : " + data.data.Country);
                save("Language : " + data.data.Language);
                save("Plot : " + data.data.Plot);
                save("Actors : " + data.data.Actors);
                save("==============================================================================================");
            }
        })
    }
}

function what() {
    fs.readFile("random.txt","utf8",function(err,res){
        if (err) {
            console.log(err);
            return;
        } else {
            var resArr = res.split(",");
            if (resArr[0] === "concert-this") {
                save("\nConcert Schedule for : " + resArr[1].slice(1,-1) + " !!! \n")
                concert(resArr[1].slice(1,-1));
            } else if (resArr[0] === "spotify-this-song") {
                save("\nResult for : " + resArr[1].slice(1,-1) + " !!! \n")
                songs(resArr[1].slice(1,-1));
            } else if(resArr[0] === "movie-this") {
                movies(resArr[1].slice(1,-1));
            } 
		} 
    });
}

function print(input) {
    fs.appendFile("log.txt",input + "\n" , function(err){
        if (err) {
            console.log(err);
        }
    })
}

function save(input) {
    print(input);
    console.log(input);
}