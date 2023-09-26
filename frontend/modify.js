import { createArtist, updateArtist } from './CRUD.js';
import { getUniqueGenres, fetchArtists } from './main.js';


window.toggleGenreSelection = function(element) {
    element.classList.toggle('selected');
};

// Function to show the "Create Artist" form
export function showCreateArtistModal(event) {
    if(event) event.preventDefault();
     const uniqueGenres = getUniqueGenres();

const genreBobbles = uniqueGenres.map(genre => `
    <div class="genre-label" data-genre="${genre}" onclick="toggleGenreSelection(this)">
        <span>${genre}</span>
    </div>
`).join('');

    const formHTML =  `
         <form id="create-artist-form">
            <img src="./genre-icons/create.png" id="CreateArtist" alt="Create Artist"/> <!-- Include the image here -->
            <h1 id="createText">Create New Artist</h1> 
            <label for="name">Name:</label>
            <input type="text" id="name" required>
            <label>Genres:</label>
            <div id="genres-bobbles">
                ${genreBobbles}
            </div>
            <label>Image:</label>
            <div>
                <input type="radio" id="uploadImage" name="imageSource" value="upload" checked>
                <label for="uploadImage">Upload</label>
                <input type="radio" id="imageLink" name="imageSource" value="link">
                <label for="imageLink">Link</label>
            </div>
            <input type="file" id="imageUpload" accept="image/*">
            <input type="text" id="imageLinkInput" placeholder="Image Link" style="display: none;">
            <label for="biography">Biography:</label>
            <textarea id="biography" required></textarea>
            <button type="submit">Create Artist</button>
        </form>
    `;

// Create the modal and content containers
    const modalContainer = document.createElement('div');
    modalContainer.id = 'createArtistModal';
    modalContainer.classList.add('create-artist-modal');
    const modalContent = document.createElement('div');
    modalContent.id = 'create-artist-content';
    modalContent.innerHTML = formHTML;

    // Append everything
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Display the modal
    modalContainer.style.display = 'block';

    // Add event listener for form submission
    document.getElementById('create-artist-form').addEventListener('submit', handleCreateArtistFormSubmission);

// Add event listener to close the modal when clicking outside of it
modalContainer.addEventListener('click', function(event) {
    const formElement = document.getElementById('create-artist-form');
    if (!formElement.contains(event.target)) {
        modalContainer.style.display = 'none';
        document.body.removeChild(modalContainer);
    }
});
}

// Add this function to your JavaScript file
function toggleGenreSelection(element) {
    element.classList.toggle('selected');
}

// Function to handle form submission
async function handleCreateArtistFormSubmission(event) {
    event.preventDefault();
    console.log("handleCreateArtistFormSubmission called");

    const newArtist = {
        name: document.getElementById('name').value,
        genres: Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(checkbox => checkbox.value),
        image: '', // Initialize image as an empty string
        biography: document.getElementById('biography').value
    };

    // Check which image source option is selected
    const uploadImageRadio = document.getElementById('uploadImage');
    if (uploadImageRadio.checked) {
        // Handle image upload
        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            newArtist.image = imageFile.name;

            // Read the image file and store it in localStorage
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = function() {
                const base64Image = reader.result.split(',')[1];
                localStorage.setItem(`artistImage_${newArtist.name}`, base64Image);
            };
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
            };
        }
    } else {
        // Handle image link
        newArtist.image = document.getElementById('imageLinkInput').value;
    }

    try {
        // Call the createArtist function from CRUD.js
        await createArtist(newArtist.name, newArtist.genres.join(','), newArtist.biography);  // Assuming genre is a comma-separated string

        // Refresh the artists list
        await fetchArtists();

        // Close the modal
        const modals = document.querySelectorAll('#createArtistModal');
        console.log("Number of modals in DOM before removal: ", modals.length);
        
        modals.forEach((modal) => {
            modal.style.display = "none";
            document.body.removeChild(modal);
        });

        console.log("Number of modals in DOM after removal: ", document.querySelectorAll('#createArtistModal').length);
        
        // Show success alert
        alert('Artist has been created :)');
        
        // Optionally, you can refresh the page
        // location.reload();
    } catch (error) {
        // Show error alert
        alert('Failed to create artist :(');
        console.error('Error creating artist:', error);
    }
}



// Function to show the "Edit Artist" form
export function showEditArtistModal(artist) {
    const uniqueGenres = getUniqueGenres();

    const genreBobbles = uniqueGenres.map(genre => `
        <div class="genre-label" data-genre="${genre}" onclick="toggleGenreSelection(this)">
            <span>${genre}</span>
        </div>
    `).join('');

    const formHTML = `
        <form id="edit-artist-form">
            <img src="./artists/${artist.id}.jpg" id="EditArtistImage" alt="Edit Artist"/>
            <label for="name">Name:</label>
            <input type="text" id="name" required>
            <label>Genres:</label>
            <div id="genres-bobbles">
                ${genreBobbles}
            </div>
            <label>Image:</label>
            <div>
                <input type="radio" id="uploadImage" name="imageSource" value="upload" checked>
                <label for="uploadImage">Upload</label>
                <input type="radio" id="imageLink" name="imageSource" value="link">
                <label for="imageLink">Link</label>
            </div>
            <input type="file" id="imageUpload" accept="image/*">
            <input type="text" id="imageLinkInput" placeholder="Image Link" style="display: none;">
            <label for="biography">Biography:</label>
            <textarea id="biography" required></textarea>
            <button type="submit">Update Artist</button>
        </form>
    `;

    // Create the modal and content containers
    const modalContainer = document.createElement('div');
    modalContainer.id = 'editArtistModal';
    modalContainer.classList.add('edit-artist-modal');
    const modalContent = document.createElement('div');
    modalContent.id = 'edit-artist-content';
    modalContent.innerHTML = formHTML;

    // Append everything
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Display the modal
    modalContainer.style.display = 'block';

    // Populate the form fields with the existing artist data
    document.getElementById('name').value = artist.name || '';
    document.getElementById('biography').textContent = artist.biography || '';

   // Handle genres (assuming genres is a comma-separated string)
    if (artist.genres) {
        const artistGenres = artist.genres.split(', '); // Convert the string to an array
        artistGenres.forEach(genre => {
            const genreElement = document.querySelector(`.genre-label[data-genre="${genre}"]`);
            if (genreElement) {
                genreElement.classList.add('selected');
            }
        });
    }

    // Add event listener for form submission
    document.getElementById('edit-artist-form').addEventListener('submit', function(event) {
        handleEditArtistFormSubmission(event, artist.id);
    });

    // Add event listener to close the modal when clicking outside of it
    modalContainer.addEventListener('click', function(event) {
        const formElement = document.getElementById('edit-artist-form');
        if (!formElement.contains(event.target)) {
            modalContainer.style.display = 'none';
            document.body.removeChild(modalContainer);
        }
    });
}

// Function to handle form submission for editing an artist
function handleEditArtistFormSubmission(event, artistId) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const genres = Array.from(document.querySelectorAll('.genre-label.selected')).map(element => element.getAttribute('data-genre')).join(', ');
    const biography = document.getElementById('biography').value;
    let image = ''; // Initialize image as an empty string

    // Check which image source option is selected
    const uploadImageRadio = document.getElementById('uploadImage');
    if (uploadImageRadio.checked) {
        // Handle image upload
        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            image = imageFile.name;
        }
    } else {
        // Handle image link
        image = document.getElementById('imageLinkInput').value;
    }

    // Call the updateArtist function from CRUD.js
    updateArtist(artistId, name, genres, biography)
        .then(() => {
            // Close the modal
            const modal = document.getElementById('editArtistModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.removeChild(modal);
            }

            // Show a success alert
            alert('Artist has been updated successfully.');

            // Refresh the artist list
            fetchArtists();  // This function should re-fetch the artists and update the UI
        })
        .catch((error) => {
            // Handle error, e.g., show an error message
            alert('Failed to update artist.');
            console.error('Error updating artist:', error);
        });
}
