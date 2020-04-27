
require("dotenv").config();

const inquirer = require("inquirer");
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const axios = require("axios");
const spotify = new Spotify(keys.spotify);
const momment = require("moment");

const liri = {



  async search(url) {
    const response = await axios.get(url);
    //console.log("response: ", response.data);
    return response.data;
  },

  concerts() {
    inquirer.prompt({
      type: "input",
      message: "What Band, or Artist would you like to look up?",
      name: "searchTerm"
    }).then(async answer => {

      var artist = answer.searchTerm.replace(" ", "+");
      const url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
      const result = await this.search(url);

      for(let i = 0; i < result.length; i++) {
        const date = momment(result[i].datetime).format("MM/DD/YYYY");
        this.printSeperator();
        console.log("Venue: " + result[i].venue.name);
        console.log("Location: " + result[i].venue.location);
        console.log("Event Date: " + date);
        this.printSeperator();
      }
    });
  },

  music() {
    inquirer.prompt({
      type: "input",
      message: "What song do you want information about?",
      name: "song"
    }).then(async answer => {
      var info = await spotify.search({type: "track", query: answer.song, limit: 1 });
      var items = info.tracks.items;

      for(let i = 0; i < items.length; i++) {
        var item = items[i];
        var artists = item.artists;
        
        var art = "";
        for(let i = 0; i < artists.length; i++) {
          if(i === artists.length - 1) {
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
    });
  },

  movies() {

  },

  async justDoIt(str1) {
    const url = "https://rest.bandsintown.com/artists/" + str1 + "/events?app_id=codingbootcamp";
    const result = await this.search(url);
    console.log(result)
  },

  printSeperator() {
    console.log("");
    console.log("**********-**********-**********-**********");
    console.log("");
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
  console.log(answer.searchType);

  switch (answer.searchType) {
    case "concert-this":
      console.log("made it!")
      liri.concerts();
      break;
    case "spotify-this-song":
      liri.music();
  }
}).catch(error => {
  console.error(error);
});

