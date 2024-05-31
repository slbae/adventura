import { getCurrentUserId, logOut } from './common.js';
import api from './APIClient.js';

// List all the current user's itineraries
function renderItineraries(itineraries) {
    console.log("Render these itineraries: " + itineraries);
    const itineraryList = document.getElementById('itineraryList');
    // Clear any existing content
    itineraryList.innerHTML = '';

    // Loop through each itinerary and create anchor elements
    itineraries.forEach(itinerary => {
        const link = document.createElement('a');
        link.classList.add('list-group-item', 'list-group-item-action');
        link.textContent = `${itinerary.city}, ${itinerary.country}`;
        link.href = `./editItinerary?id=${itinerary.id}`; // Link to the edit page with the itinerary ID as a query parameter
        itineraryList.appendChild(link);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    return fetch(`/api/itineraries`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Render itineraries
            renderItineraries(data);
        })
        .catch(error => {
            console.error('Error fetching itineraries:', error);
        });
});
