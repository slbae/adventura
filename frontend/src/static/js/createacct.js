import api from './APIClient.js'; // Make sure this path is correct.

document.addEventListener('DOMContentLoaded', () => {

    const signUpButton = document.getElementById('signUp');

    signUpButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission
        // Check if the user is offline
        if (!navigator.onLine) {
            // Redirect to the offline page
            document.location = './offline';
            return;
        }
        else {
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Construction of the the user object
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                avatar: "https://robohash.org/hicetminus.png?size=64x64&set=set1", // Add a default or placeholder avatar URL
                password: password
                // Add other fields if necessary
            };

            // Use the API client to send the POST request
            api.post('/api/users', newUser)
                .then(response => {
                    console.log(response);
                    console.log('Success!');
                    // Redirect to the login page
                    document.location = './'
                })
                .catch(error => {
                    console.error('Signup failed:', error);
                    // Handle signup errors
                    alert('Signup failed: ' + error.message);
                });
        }
    });
});
