import { displayArtists, displayAlbums, displayTracks } from './main.js';

let artists = [];

// Create an artist
function createArtist(name, genre, biography) {
    return new Promise((resolve, reject) => {
        fetch('/artists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                genre: genre,
                biography: biography
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Artist creation successful");
            resolve(data);
        })
        .catch(error => {
            console.log("Artist creation failed");
            reject(error);
        });
    });
}

// Update an artist
function updateArtist(id, name, genre, biography) {
    const updatedArtist = {
        name: name,
        genre: genre,
        biography: biography
    };
    console.log("Sending this data to server:", JSON.stringify(updatedArtist));

    return fetch(`/artists/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedArtist)
    })
    .then(response => response.json())
    .then(data => {
        const index = artists.findIndex(artist => artist.id === id);
        if (index !== -1) {
            artists[index] = data;
            displayArtists(artists);
        }
    })
    .catch(error => {
        console.error('Error updating artist:', error);
        throw error;
    });
}


// Delete an artist
function deleteArtist(id) {
    return new Promise((resolve, reject) => {
        fetch(`/artists/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Assuming artists is accessible here
                artists = artists.filter(artist => artist.id !== id);
                displayArtists(artists);
                resolve(); // Resolve the promise
            } else {
                reject('Failed to delete artist'); // Reject the promise if the fetch failed
            }
        })
        .catch(error => {
            console.error('Error deleting artist:', error);
            reject(error); // Reject the promise if there was an error
        });
    });
}


// Modify Albums

// Create an album
function createAlbum(title, artistId, releaseDate) {
    console.log(`Creating album: ${title}, Artist ID: ${artistId}, Release Date: ${releaseDate}`);
    fetch('/albums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            artist_id: artistId,
            release_date: releaseDate
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Album created:", data);
        // Assuming 'albums' is an array that holds your albums
        albums.push(data);
        // Assuming 'displayAlbums' is a function that takes an array of albums and displays them
        displayAlbums(albums);
    })
    .catch(error => {
        console.error('Error creating album:', error);
    });
}

// Update an album
function updateAlbum(id, title, artistId, releaseDate) {
    console.log(`Updating album with ID ${id}: ${title}, Artist ID: ${artistId}, Release Date: ${releaseDate}`);
    fetch(`/albums/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            artist_id: artistId,
            release_date: releaseDate
        })
    })
    .then(response => response.json())
    .then(data => {
        const index = albums.findIndex(album => album.id === id);
        if (index !== -1) {
            albums[index] = data;
            displayAlbums(albums);
        }
    })
    .catch(error => {
        console.error('Error updating album:', error);
    });
}

// Delete an album
function deleteAlbum(id) {
    console.log(`Deleting album with ID ${id}`);
    fetch(`/albums/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        albums = albums.filter(album => album.id !== id);
        displayAlbums(albums);
    })
    .catch(error => {
        console.error('Error deleting album:', error);
    });
}


// Modify Tracks

// Create a track
function createTrack(title, albumId, duration) {
    console.log(`Creating track: ${title}, Album ID: ${albumId}, Duration: ${duration}`);
    fetch('/tracks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            album_id: albumId,
            duration: duration
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Track created:", data);
        // Assuming 'tracks' is an array that holds your tracks
        tracks.push(data);
        // Assuming 'displayTracks' is a function that takes an array of tracks and displays them
        displayTracks(tracks);
    })
    .catch(error => {
        console.error('Error creating track:', error);
    });
}

// Update a track
function updateTrack(id, title, albumId, duration) {
    console.log(`Updating track with ID ${id}: ${title}, Album ID: ${albumId}, Duration: ${duration}`);
    fetch(`/tracks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            album_id: albumId,
            duration: duration
        })
    })
    .then(response => response.json())
    .then(data => {
        const index = tracks.findIndex(track => track.id === id);
        if (index !== -1) {
            tracks[index] = data;
            displayTracks(tracks);
        }
    })
    .catch(error => {
        console.error('Error updating track:', error);
    });
}

// Delete a track
function deleteTrack(id) {
    console.log(`Deleting track with ID ${id}`);
    fetch(`/tracks/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        tracks = tracks.filter(track => track.id !== id);
        displayTracks(tracks);
    })
    .catch(error => {
        console.error('Error deleting track:', error);
    });
}


// Export block
export {
  createArtist,
  updateArtist,
  deleteArtist,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  createTrack,
  updateTrack,
  deleteTrack
};