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
    // variavel que guarda o que foi escrito no input
    let artistFromForm = req.query.artist;

    spotifyApi.searchArtists(artistFromForm)
    .then(result => {

        let artistSearched = result.body.artists.items;
     //   console.log('The received data from the API: ', artistSearched);
        res.render('artist-search', {artist: artistSearched});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:artistId', (req, res) =>{
    let artistId = req.params.artistId; // vai buscar o ID da route que pusemos no botão

    spotifyApi.getArtistAlbums(artistId).then((data) => {
       // console.log('received data', data.body)
        let albumsResults = data.body.items;
        res.render('albums', {albums: albumsResults});
    }); 
});

app.get('/tracks/:tracksId', (req, res) => {
    let tracksId = req.params.tracksId;

    spotifyApi.getAlbumTracks(tracksId).then((data) =>{
        console.log('received data', data.body)
        let albumTracks = data.body.items;

        res.render('tracks', {tracks: albumTracks});
    })
});












app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
