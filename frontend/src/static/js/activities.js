
import api from './APIClient.js'; // Adjust the path as needed
import { getCurrentUserId, logOut } from './common.js';

let currentUser = {};

function fetchCurrentUserId() {
    api.get('/api/currentuserid')
        .then(data => {
            currentUser.id = data.userid; // Correctly assign the userID to currentUser.id
            console.log('Current User ID:', currentUser.id);
        })
        .catch(error => {
            console.error('Failed to fetch current user ID:', error);
        });
}



function fetchAndDisplayActivities() {
    const activitiesListElement = document.getElementById('activities-list');
    api.get('/api/activities')
    .then(activities => {
        activitiesListElement.innerHTML = '';
        activities.forEach(activity => {
            const listItem = document.createElement('li');
            const likeCounter = document.createElement('span');
            likeCounter.textContent = `Likes: ${activity.like_count}`;
            likeCounter.classList.add('like-counter');
            const likeButton = document.createElement('button');
            likeButton.textContent = activity.liked ? 'Unlike' : 'Like';
            likeButton.classList.add('like-button');
            likeButton.dataset.liked = activity.liked.toString();
            likeButton.dataset.activityId = activity.activity_id;
            
            likeButton.addEventListener('click', function() {
                toggleLike(activity.activity_id, this);
            });

            listItem.textContent = `${activity.activity_name} in ${activity.activity_city} - Price: $${activity.activity_price} `;
            listItem.appendChild(likeButton);
            listItem.appendChild(likeCounter);
            activitiesListElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Failed to fetch and display activities:', error);
    });
}
function toggleLike(activityId, button) {
    const isLiked = button.dataset.liked === 'true';
    button.dataset.liked = isLiked ? 'false' : 'true';
    button.innerHTML = isLiked ? 'Like' : 'Unlike';

    // Call API to toggle like status, using the currentUser ID
    api.post(`/api/activities/${activityId}/like`, { userId: currentUser.id })
        .then((response) => {
            console.log('Like status toggled');
            // Find and update the like counter for this activity
            const likeCounter = button.nextElementSibling;
            likeCounter.textContent = `Likes: ${response.likeCount}`;
         })
        .catch(error => {
            console.error('Failed to toggle like status:', error);
        });
}



function searchActivities(searchTerm) {
    const activitiesListElement = document.getElementById('activities-list');
    
    // Clear previous search results
    activitiesListElement.innerHTML = '';
  
    // Call the API to search activities by searchTerm
    api.get(`/api/activities/search?query=${encodeURIComponent(searchTerm)}`)
      .then(activities => {
        activities.forEach(activity => {
          const listItem = document.createElement('li');
          const likeButton = document.createElement('button');
          likeButton.textContent = activity.liked ? 'Unlike' : 'Like';
          likeButton.classList.add('like-button');
          likeButton.dataset.liked = activity.liked.toString();
          likeButton.dataset.activityId = activity.activity_id;
          
          likeButton.addEventListener('click', function() {
            toggleLike(activity.activity_id, this);
          });
          
          listItem.textContent = `${activity.activity_name} in ${activity.activity_city} - Price: $${activity.activity_price} `;
          listItem.appendChild(likeButton);
          activitiesListElement.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Search failed:', error);
        // Optionally, display an error message to the user
      });
}
//  DEFUNCT
//function searchActivities(searchTerm) {
//     const activitiesListElement = document.getElementById('activities-list');
    
//     // Clear previous search results
//     activitiesListElement.innerHTML = '';
  
//     // Call the API to search activities by searchTerm
//     api.get(`/api/activities/search?query=${encodeURIComponent(searchTerm)}`)
//       .then(activities => {
//         activities.forEach(activity => {
//           const listItem = document.createElement('li');
//           listItem.textContent = `${activity.activity_name} in ${activity.activity_city} - Price: $${activity.activity_price} `;

//           // Create and append the Like/Unlike button
//           const likeButton = document.createElement('button');
//           likeButton.textContent = activity.liked ? 'Unlike' : 'Like';
//           likeButton.classList.add('like-button');
//           likeButton.dataset.liked = activity.liked.toString();
//           likeButton.dataset.activityId = activity.activity_id;
          
//           likeButton.addEventListener('click', function() {
//             toggleLike(activity.activity_id, this);
//           });

//           // Create and append the like counter span
//           const likeCounter = document.createElement('span');
//           likeCounter.textContent = `Likes: ${activity.like_count}`;
//           likeCounter.classList.add('like-counter');

//           listItem.appendChild(likeButton);
//           listItem.appendChild(likeCounter);
//           activitiesListElement.appendChild(listItem);
//         });
//       })
//       .catch(error => {
//         console.error('Search failed:', error);
//         // Optionally, display an error message to the user
//       });
// }


document.addEventListener('DOMContentLoaded', () => {
    fetchCurrentUserId(); // Fetch the current user ID
    // Call the function to display the activities when the page loads
    fetchAndDisplayActivities();

    const logoutButton = document.getElementById('logoutbtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', e => {
            e.preventDefault();
            logOut(); // Call the logOut function when the logout button is clicked
        });
    }
    const searchButton = document.getElementById('searchbtn'); // Modify this if you have a specific ID for the search button
    searchButton.addEventListener('click', () => {
    const searchTerm = document.getElementById('searchActivities').value;
    searchActivities(searchTerm);
  });
});
