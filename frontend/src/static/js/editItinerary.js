import api from './APIClient.js';

async function updateItinerary(event) {
    event.preventDefault();
    const itineraryId = new URLSearchParams(window.location.search).get('id');

    // Can only edit these fields:
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    const budget = parseInt(document.getElementById('budget').value);

    // Get the list of collaborators

    const collaboratorsInput = document.getElementById('addCollaborator').value;

    // Update itinerary
    const newItinerary = {
        id: itineraryId,
        startdate: startdate,
        enddate: enddate,
        budget: budget,
        collaborators: collaboratorsInput
    };

    try {
        const response = await fetch(`/api/itineraries/${itineraryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItinerary)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const message = document.getElementById('message');
        message.textContent = "Itinerary updated successfully!";
        fetchItineraryDetails(itineraryId);
        document.getElementById('addCollaborator').value = '';

        console.log("Itinerary updated successfully!");
    } catch (error) {
        console.error('Failed to update itinerary:', error);
        const message = document.getElementById('message');
        message.textContent = "Failed to update itinerary: " + error.message;
    }
}

// Function to extract the itinerary ID from the URL query parameters
function getItineraryIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Function to fetch itinerary details from the server
function fetchItineraryDetails(itineraryId) {
    api.getItineraryById(parseInt(itineraryId))
        .then(iti => {
            console.log("huuknm");
            console.log(iti);
            populateForm(iti);
        })
        .catch(err => {
            console.error('Failed to fetch itinerary details:', err);
            document.getElementById('message').textContent = 'Failed to load itinerary details.';
        });
}

// Function to populate the HTML form with data fetched from the server
function populateForm(itinerary) {
    console.log("hu");
    document.getElementById('country').value = itinerary.country;
    document.getElementById('city').value = itinerary.city;
    document.getElementById('startdate').value = formatDate(itinerary.startdate);
    document.getElementById('enddate').value = formatDate(itinerary.enddate);
    document.getElementById('budget').value = parseInt(itinerary.budget);
    console.log("huu");

    const collaboratorsContainer = document.querySelectorAll('collaborators-container');
    const collaborators = itinerary.collaborator;
    console.log(itinerary);
    console.log("popupupupu");
    console.log(collaborators);
    const collaboratorValParagraph = document.getElementById('collaboratorval');
    collaboratorValParagraph.textContent = collaborators;
}

// Function to format date to yyyy-mm-dd format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is offline
    if (!navigator.onLine) {
        // Redirect to the offline page
        document.location = './offline';
    }
    else {
        const itineraryId = getItineraryIdFromUrl();
        console.log(itineraryId);
        if (itineraryId) {
            fetchItineraryDetails(itineraryId);
        } else {
            console.error('No itinerary ID provided.');
            document.getElementById('message').textContent = 'No itinerary ID provided.';
            // Optionally redirect back or display an error message
        }
    }
});

// Check if the user is offline
if (!navigator.onLine) {
    // Redirect to the offline page
    document.location = './offline';
}
else {
    document.getElementById('editItineraryForm').addEventListener('submit', updateItinerary);
}