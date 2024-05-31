
import { logOut } from './common.js'; // Import the logOut function

// Navbar
document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logoutbtn');
    if (logoutButton) {
       
            logoutButton.addEventListener('click', e => {
                e.preventDefault();
                logOut(); // Call the logOut function when the logout button is clicked
            });
        
    }

    const activityLink = document.getElementById('activities');
    if (activityLink) {
        activityLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor action
            document.location = "./activities";
        });
    }

    const itinerariesLink = document.getElementById('itineraries');
    const createItineraryLink = document.getElementById('createItinerary');
    const createItineraryALT = document.getElementById('altlink');


    if (itinerariesLink) {
        itinerariesLink.addEventListener('click', (event) => {
            event.preventDefault();
            document.location = "./itineraries";
        });
    }
    if (createItineraryLink) {
       
            createItineraryLink.addEventListener('click', (event) => {
                event.preventDefault();
                document.location = "./itinerary";
            });
        
    }
    if (createItineraryALT) {
       
        createItineraryALT.addEventListener('click', (event) => {
            event.preventDefault();
            document.location = "./itinerary";
        });
    
}

    const menu = document.getElementById('navbar-brand');
    if (menu) {
        menu.addEventListener('click', (event) => {
            event.preventDefault(); 
            document.location = './menu';
        });
    }
});
