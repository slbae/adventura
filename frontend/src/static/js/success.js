import api from './APIClient.js';

document.addEventListener('DOMContentLoaded', () => {

    const view = document.getElementById('viewItineraries');
    if (view) {
       
                view.addEventListener('click', e => {
                e.preventDefault();
                document.location = "./itineraries";
            });
        
    }
});