const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const apiRouter = express.Router();
const UserDAO = require('./db/UserDAO.js');
const ActivityDAO = require('./db/ActivityDAO.js');
const ItineraryDAO = require('./db/ItineraryDAO.js');
const { TokenMiddleware, generateToken, removeToken } = require('./middleware/TokenMiddleware');

// Middleware to parse JSON bodies
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use(bodyParser.json());
apiRouter.use(cookieParser());

// Create a new user account
apiRouter.post('/users', (req, res) => {
    // Extract all the necessary fields from the request body
    const { firstName, lastName, username, avatar, password } = req.body;

    // Call createUser from your UserDAO with all the necessary fields
    UserDAO.createUser(firstName, lastName, username, avatar, password)
        .then(user => {
            res.status(201).json(user); // Use 201 status code for created resource
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: 'User could not be created', details: error.message });
        });
});

// Authenticate a user
apiRouter.post('/users/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserDAO.getUserByCredentials(username, password).then(user => {
        let result = {
            user: user
        }
        generateToken(req, res, user);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(404).json({ error: err.message });
    });
});

// Logout user
apiRouter.post('/users/logout', TokenMiddleware, (req, res) => {
    removeToken(req, res);
    res.json({ logout: true });
});

// Get a user's friends list
apiRouter.get('/users/:userId/friends', async (req, res) => {
    try {
        const { userId } = req.params;
        const friends = await UserDAO.getUserFriends(userId);
        res.json(friends);
    } catch (error) {
        console.error('Failed to get friends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get the current user
apiRouter.get('/currentuser', TokenMiddleware, (req, res) => {
    // The TokenMiddleware has already verified the token and set req.user
    res.json({ user: req.user });
});

// Get the current user's id
apiRouter.get('/currentuserid', TokenMiddleware, (req, res) => {
    // The TokenMiddleware has already verified the token and set req.user
    res.json({ userid: req.user.id });
});

// Get all activities with likes
apiRouter.get('/activities', TokenMiddleware, (req, res) => {
    ActivityDAO.getActivitiesWithLikes(req.user.id)
        .then(activities => res.json(activities))
        .catch(err => res.status(500).json({ error: "Database error occurred." }));
});

// Get user's id by their username
apiRouter.get('/getUserId', async (req, res) => {
    try {
        const { username } = req.query;
        const user = await UserDAO.getUserByUsername(username);
        console.log(user); // This will show you what the user object looks like
        if (user) {
            res.json({ userId: user.usr_id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error in /getUserId:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user by id
apiRouter.get('/users/:id', (req, res) => {
    try {
        const user = UserDAO.getUserById(req.params.id);
        res.json(user);
    }
    catch (error) {
        console.error('Failed to get user with id: ', req.params.id);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a user by their username
apiRouter.get('/users/search', async (req, res) => {
    try {
        const { username } = req.query;
        // implement the search functionality in UserDAO
        const searchResults = await UserDAO.searchByUsername(username);
        res.json(searchResults);
    } catch (error) {
        console.error('User search failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get itinerary by id
apiRouter.get('/itineraries/:id', async (req, res) => {
    const itineraryId = parseInt(req.params.id);
    console.log(`Fetching itinerary with ID: ${itineraryId}`);
    try {
        const itinerary = await ItineraryDAO.getItineraryById(itineraryId);
        if (itinerary) {
            console.log("Itineraryyoolo");
            console.log(itinerary);
            res.json(itinerary);
        } else {
            res.status(404).json({ error: 'Itinerary not found' });
        }
    } catch (error) {
        console.error('Error fetching itinerary by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new itinerary
apiRouter.post('/itinerary', TokenMiddleware, (req, res) => {
    const country = req.body.country;
    const city = req.body.city;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const budget = req.body.budget;
    const collaborators = req.body.collaborators;
    const author = req.user.id;
    console.log("BANANAMAN");
    console.log(author);

    const itinerary = {
        country: country,
        city: city,
        startdate: startdate,
        enddate: enddate,
        author: author,
        budget: budget,
        collaborators: collaborators,
        schedule: {}
    }
    ItineraryDAO.createItinerary(itinerary);
    res.json(itinerary);
});

// Get all the current user's itineraries
apiRouter.get('/itineraries', TokenMiddleware, (req, res) => {
    // Assuming currentUser.id is the numeric ID of the logged-in user
    ItineraryDAO.getItinerariesByUserId(req.user.id)
        .then(itineraries => {
            console.log("MY NAME IS MLK");
            console.log(req.user.id);
            res.json(itineraries); // Send the itineraries as a JSON response.
        })
        .catch(err => {
            console.error('Error fetching itineraries:', err);
            res.status(500).json({ error: 'Error fetching itineraries', details: err.message });
        });
});

// Edit itinerary
apiRouter.put('/itineraries/:id', async (req, res) => {
    const updatedItinerary = req.body;
    console.log("UPDATED ITINERAR");
    console.log(req.body);
    try {
        const updated = await ItineraryDAO.updateItinerary(updatedItinerary);
        if (!updated) {
            return res.status(404).json({ message: "Failed to update itinerary" });
        }
        res.json({ message: "Itinerary updated successfully", updated });
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});

// Add a friend to a user's friend list
apiRouter.post('/users/:userId/addfriend', TokenMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body; // The ID of the user to add as a friend

        // Check if they are already friends to prevent duplicates
        const isAlreadyFriend = await UserDAO.checkFriendship(userId, friendId);
        if (isAlreadyFriend) {
            return res.status(409).json({ error: 'Users are already friends' });
        }

        await UserDAO.addFriend(userId, friendId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove a friend from a user's friend list
apiRouter.post('/users/:userId/removefriend', TokenMiddleware, async (req, res) => {
    const userId = req.params.userId; // Assuming this is the ID of the current user
    const { friendId } = req.body; // The ID of the friend to be removed

    try {
        await UserDAO.removeFriend(userId, friendId);
        res.json({ success: true, message: 'Friend removed successfully.' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'Failed to remove friend.' });
    }
});

// Search activities by keywords
apiRouter.get('/activities/search', TokenMiddleware, async (req, res) => {
    try {
        const searchTerm = req.query.query;
        const userId = req.user.id; // Get the user ID from the token middleware
        const results = await ActivityDAO.searchActivitiesWithLikes(searchTerm, userId);
        res.json(results);
    } catch (error) {
        console.error('Activity search failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a like to an activity with activityId
apiRouter.post('/activities/:activityId/like', TokenMiddleware, async (req, res) => {
    const activityId = req.params.activityId;
    const userId = req.user.id; // Make sure TokenMiddleware sets req.user

    try {
        const likeCount = await ActivityDAO.toggleLikeStatus(activityId, userId);
        res.json({ success: true, likeCount: likeCount });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Database error occurred' });
    }
});


module.exports = apiRouter;