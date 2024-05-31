const express = require('express');

const path = require('path');
const frontendRouter = express.Router();

frontendRouter.use(express.json());
frontendRouter.use(express.static(__dirname + '/static'));

const html_path = __dirname + '/templates/'; // HTML template file folder

/*****************\
* FRONTEND ROUTES *
\*****************/

frontendRouter.get('/', (req, res) => {
    res.sendFile(html_path + 'index.html');
});
frontendRouter.get('/menu', (req, res) => {
    res.sendFile(html_path + 'menu.html');
});
frontendRouter.get('/itineraries', (req, res) => {
    res.sendFile(html_path + 'itineraries.html');
});
frontendRouter.get('/itinerary', (req, res) => {
    res.sendFile(html_path + 'createItinerary.html');
});
frontendRouter.get('/editItinerary', (req, res) => {
    res.sendFile(html_path + 'editItinerary.html');
});
frontendRouter.get('/signup', (req, res) => {
    res.sendFile(html_path + 'signup.html');
});
frontendRouter.get('/activities', (req, res) => {
    res.sendFile(html_path + 'activities.html');
});
frontendRouter.get('/offline', (req,  res) => {
    res.sendFile(html_path + 'offline.html');
});
frontendRouter.get('/success', (req,  res) => {
    res.sendFile(html_path + 'success.html');
});

module.exports = frontendRouter;