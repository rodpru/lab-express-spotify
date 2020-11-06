require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser'); //use body param



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    console.log('where on index')
    
    res.render('index');
});


app.get('/artist-search', (req, res) => {
    let artistFromForm = req.query.artist;

    spotifyApi.searchArtists(artistFromForm)
    .then(result => {

        let artistSearched = result.body.artists.items;
     //   console.log('The received data from the API: ', artistSearched);
        res.render('artist-search', {artist: artistSearched});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});












app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
