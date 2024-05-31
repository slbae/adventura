import api from './APIClient.js';

const loginButton = document.querySelector('#loginButton');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const createAccountBtn = document.querySelector('#createacctbtn');


const errorBox = document.querySelector('#errorBox');


loginButton.addEventListener('click', e => {
     e.preventDefault();
    // //Check if the user is offline
    // if (!navigator.onLine) {
    //     // Redirect to the offline page
    //     console.log("LOGIN OFFLINE");
    //     document.location = './offline';
    // }
    // else {

        errorBox.classList.add("hidden");

        api.login(username.value, password.value).then(userData => {
            document.location = "./menu";
        }).catch((err) => {
            errorBox.classList.remove("hidden");
            if (err.status === 401) {
                errorBox.innerHTML = "Invalid username or password";
            }
            else {
                errorBox.innerHTML = err;
            }
        });
   // }
});

if (createAccountBtn) {
    createAccountBtn.addEventListener('click', e => {
        e.preventDefault();
        document.location = "./signup";
    });
}
