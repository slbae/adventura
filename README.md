# Adventura - Web Development Final Team Project

## Problem Statement: 
This installable progressive web application (PWA) is catered towards students and young adults on a budget who want to travel during breaks. They can plan a trip by creating itineraries, searching and favoriting activities for their destination, and adding collaborators to the trip planning. This app will be more student-friendly since traveling can sometimes be intimidating by yourself, especially if you haven’t traveled very often before. 

## Current Features:
* Create user accounts, user authentication, login/logout
* Ability to add other users to collaborate on the same trip itinerary
* Ability to view all itineraries the current user created and is collaborating on
* Ability to edit all itineraries the current user created and is collaborating on
* Search functionality for relevant travel activities
* Ability to filter activities by location
* Ability to see the cost of each activity when planning a trip 
* Ability to view the number of likes an activity has accumulated from all users
* Offline/cached functionality to access the app when offline. The cached data will be available to view. Data may not be modified while the user is offline.

## Future Feature Ideas:
* Ability to add activities to the daily itinerary for a custom time frame
* Ability to add custom activities and post them to the activities data schema
* Ability to review activities 
* Ability to view other users’ reviews on different activities to determine if they are worth adding to their itineraries
* Ability to input a budget and then see trips and activities that you can afford
* Budgeting calculator to estimate the total cost of a destination trip for the length of a given vacation
* Weather forecaster for a destination
* Fashion trend forecaster for a destination for the season the vacation will be in 
* Currency conversion calculator
* Ability to view popular tourist attractions for a given destination
* Mobile and desktop push notifications
* Ability to create packing lists for a trip
* Ability to spin the globe to randomly pick a destination 

## Data required:
* Users profiles will be added as they create accounts (username, password)
* Itineraries will be added as users make them
* Travel restaurants/activities will be seeded with a predefined data schema
* Costs of each activity
* The user’s budget

## Benefits of PWA Structure: 
* While people are traveling, they can easily pull up their itineraries on-the-go on their mobile devices 
* Mobile devices are more portable for users seeking to find nearby travel activities 
* Users will be able to view their itineraries while offline in case they have no access to the internet or cellular data
* Supports desktop app functionality, which will give users easy access to their accounts
* Desktop and mobile support offers flexibility for users with specific device preferences while traveling and planning in advance.
* The ability to run on the web browser expands the user base since it is not dependent on a particular platform/device/operating system to run. We want to cater to a broad user base without any device constraints. 

## Mobile & Desktop Figma Wireframes
View the entire wireframe at a high resolution here: https://www.figma.com/file/DMUdCdRXWjwbu4leiZnIJ2/Adventura?type=design&node-id=0%3A1&mode=design&t=RbDZga5hmWWE9EJH-1  

## User Authentication/Authorization Processes 
Authentication is handled via our JWT token middleware that works with cookies. The authentication process utilizes JSON Web Tokens for verifying user identities, checking for tokens in browser cookies or the Authorization header. Tokens are decoded using a secret key (API_SECRET) which allows us to extract user details, serving as the basis for authorization and ensuring only authorized access to our middleware protected routes. User data and session expiry information are securely stored within the JWT. The middleware denies access and returns a 401 status if no valid token is present, ensuring security. Our token generation function involves embedding user details and an expiration time into the JWT. Token invalidation is handled by setting the cookie's expiration to a past date. These security measures ensure controlled access to the application resources, maintaining user authentication and authorization integrity.

## Caching Strategy 
The caching strategy is employed via our Service Worker. This utilizes a cache-first approach, prioritizing the speed and reliability of content delivery by pre-caching essential static assets during installation. For our dynamic content, particularly API GET requests, it defaults to cache but fetches from the network if necessary, ensuring data is served when available. The strategy includes an efficient cleanup process during activation, removing outdated caches to manage storage efficiently and prevent the data from going stale. In instances of network failure, we fallback to serving a pre-cached offline page, maintaining functionality and user interaction. 

#### API Endpoints

Method | Route                 | Description
------ | --------------------- | ---------
`POST` | `/register`           | Creates a new user account and returns the new user object
`POST ` | `/users/login`              | Authenticate user account and returns the user object
`POST ` | `/users/logout`              | Logout user
`GET ` | `/users`              | List of all users
`POST` | `/itinerary`        | Creates newitinerary
`GET`  | `/itineraries`  | Gets the user's itineraries
`PUT`  | `/itineraries/:name`  | Edits existing itinerary
`GEt`  | `/itineraries/:id`  | Get itinerary by its id
`GET`  | `/activities`         | Returns all activities
`GET`  | `/friends`            | Returns a list of all users
`POST` | `/friends/:username`  | Adds a user to a user's friend list
`PUT`  | `/collaborators/:itineraryId/:username`    | Adds a user to an itinerary as a collaborator
`GET`  | `/itineraries`        | Returns a list of the user's itineraries
`GET`  | `/itineraries/:id`    | Returns an itinerary by its id
`GET`  | `/users`              | Returns all users
`GET`  | `/currentuser`        | Returns the currentUser
`GET`  | `/users/:userId/friends`        | Gets list of user's friends
`GET`  | `activities`        | Gets all activities

#### Pages

* Menu- The landing page after successful login. Can directly navigate to My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* Sign Up- Users can create accounts with their name, username, and password. Can directly navigate to the login page.
* Login/Logout- User inputs username and password, credentials are authenticated, and user gets logged in. Can directly navigate to the sign up page.
* Create New Itinerary- Input the country, city, start/end date, budget, collaborator to create a new itinerary. Can directly navigate to Menu, My Itineraries, Search Activities, Find Friends, and Logout.
* Edit Itinerary- Can be accessed by clicking on an itinerary in the My Itineraries page. Itinerary fields can be edited and updated. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* My Itineraries- Populates a list of the current user's itineraries. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* Search Activities- Has offline functionality. User can search for keywords and activities will be filtered. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Find Friends, and Logout.

### Team Member Contributions

#### Sylbi Bae's contributions
Milestone 1:
* API design, implementation, and testing
* HTML/CSS/Bootstrap Frontend Implementation

Milestone 2:
* Create new itinerary functionality
* View My Itineraries functionality
* Itinerary Database

Final Project:
* Create New Itinerary, Edit Itinerary, View My Itineraries fullstack functionality
* Offline functionality
* Installable PWA, favicon
