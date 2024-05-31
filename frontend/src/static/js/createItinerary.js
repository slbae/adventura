import api from './APIClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createItineraryForm');
    form.addEventListener('submit', createItinerary);
});

async function getUsernameId(username) {
    try {
      const response = await fetch(`/api/getUserId?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to get user ID for username: ${username}`);
      }
      if (typeof data.userId === 'undefined') {
        throw new Error(`No user ID returned for username: ${username}`);
      }
      return data.userId;
    } catch (error) {
      console.error(`Error getting user ID for username "${username}":`, error);
      throw error; // This will cause the Promise.all to reject
    }
  }
  async function createItinerary(event) {
    event.preventDefault();
    
    // Get form input values
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    const budget = document.getElementById('budget').value;

    let collaboratorUsername = document.getElementById('invitefriends').value;
  
    // Prepare the itinerary object with the usernames
    const itinerary = {
      country: country,
      city: city,
      startdate: startdate,
      enddate: enddate,
      author: 1, // This should be the ID of the currently logged-in user
      budget: budget,
      schedule: {},
      collaborators: collaboratorUsername || ''
    };
    
    console.log(itinerary);
  
    // Send the itinerary to the server
    try {
      const result = await api.createItinerary(itinerary);
      console.log(result);
      document.location = "./success";
      // Display a success message or redirect the user
    } catch (err) {
      console.error('Failed to create itinerary:', err);
      // Display an error message to the user
    }
  }
  