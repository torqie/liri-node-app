
require("dotenv").config();

const inquirer = require("inquirer");
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const axios = require("axios");
const spotify = new Spotify(keys.spotify);
const momment = require("moment");
const fs = require("fs");

const liri = {

  async search(url) {
    liri.log("Getting data from " + url);
    const response = await axios.get(url);
    liri.log("Response Received");
    return response;
  },

  async concerts(band = null) {
    if(band !== null) {
      var artist = band.replace(" ", "+").replace(/"/g, '');
      const url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
      const result = await this.search(url);

      this.displayConcerts(result);
    } else {
      inquirer.prompt({
        type: "input",
        message: "What Band, or Artist would you like to look up?",
        name: "artist",
        default: "kid rock"
      }).then(async answer => {
        var artist = answer.artist.replace(" ", "+");
        const url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        const result = await this.search(url);
        this.displayConcerts(result);
      });
    }
  },

  displayConcerts(result) {
    for (let i = 0; i < result.data.length; i++) {
      const concert = result.data[i];
      const date = momment(concert.datetime).format("MM/DD/YYYY");
      this.printSeperator();
      console.log("Venue: " + concert.venue.name);
      console.log("Location: " + concert.venue.location);
      console.log("Event Date: " + date);
      this.printSeperator();
    }
    liri.log("Displaying Concerts Successful");
  },

  async music(song = null) {
    if(song !== null) {
      var info = await spotify.search({type: "track", query: song, limit: 5 });
      liri.log("Response Received");
      this.displayMusic(info.tracks.items);
    } else {
      inquirer.prompt({
        type: "input",
        message: "What song do you want information about?",
        name: "song",
        default: "The Sign"
      }).then(async answer => {
        var info = await spotify.search({type: "track", query: answer.song, limit: 3});
        liri.log("Response Received");
        this.displayMusic(info.tracks.items);
      });
    }
  },

  displayMusic(items) {
    for (let i = 0; i < items.length; i++) {
      var item = items[i];
      var artists = item.artists;

      var art = "";
      for (let i = 0; i < artists.length; i++) {
        if (i === artists.length - 1) {
          art += artists[i].name;
        } else {
          art += artists[i].name + ", ";
        }
      }

      this.printSeperator();
      console.log("Artists: ", art);
      console.log("Song Name: ", item.name);
      console.log("Preview Link: ", item.external_urls.spotify);
      console.log("album: ", item.album.name);
      this.printSeperator();

    }
    liri.log("Displayed Music Successfully")
  },

  async movies(movie = null) {

    if(movie !== null) {
      var title = movie.replace(" ", "+").replace(/"/g, '');
      var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + title;
      let result = await this.search(url);
      this.displayMovies(result.data);
    } else {
      inquirer.prompt({
        type: "input",
        message: "What movie would you like to look up?",
        name: "movie",
        default: "Mr. Nobody."
      }).then(async answer => {
        var title = answer.movie.replace(" ", "+");
        var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + title;
        let result = await this.search(url);
        this.displayMovies(result.data);
      });
    }

  },

  displayMovies(result) {
    this.printSeperator();
    console.log("Title: " + result.Title);
    console.log("Year: " + result.Year);
    console.log("IMDB Rating: " + result.imdbRating);
    console.log("Rotten Tomatoes: " + result.Ratings[1].Value);
    console.log("country: " + result.Country);
    console.log("language: " + result.Language);
    console.log("actors: " + result.Actors);
    console.log("plot: " + result.Plot);
    this.printSeperator();

    liri.log("Displayed Movies Successfully")
  },

  async justDoIt() {
    const text = fs.readFile('./random.txt', function (err, data) {
      if (err) {
        return console.error(err);
      }
      const keyValue = data.toString().split(",");
      console.log("Key Value: ", keyValue);
      liri.start(keyValue[0], keyValue[1]);
    });

  },

  start(choice, value) {
    switch (choice) {
      case "concert-this":
        liri.log("Command: liri.concerts(" + value + ")");
        liri.concerts(value);
        break;

      case "spotify-this-song":
        liri.log("Command: liri.music(" + value + ")");
        liri.music(value);
        break;

      case "movie-this":
        liri.log("Command: liri.movies(" + value + ")");
        liri.movies(value);
        break;

      case "do-what-it-says":
        liri.log("Command: liri.justDoIt()");
        liri.justDoIt();
        break;
    }
  },

  printSeperator() {
    console.log("");
    console.log("**********-**********-**********-**********");
    console.log("");
  },

  log(message) {
    fs.appendFile('log.txt', message + "\r\n", function (err) {
      if (err) throw err;
    });
  }

}


inquirer.prompt([
  {
    type: "list",
    message: "Please Select one...",
    choices: [
      "concert-this",
      "spotify-this-song",
      "movie-this",
      "do-what-it-says"
    ],
    name: "searchType"
  }
]).then(answer => {
  liri.log("Command: liri.start(" + answer.searchType + ")")
  liri.start(answer.searchType);
}).catch(error => {
  liri.log("Error: " + error);
});

