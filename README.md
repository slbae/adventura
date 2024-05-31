# Adventura
## Group D: Final Project

What works (description of your features) and what doesn't work (any known issues)
### Working Features: 
<ul>
  <li> Account Creation 
    <ul> 
      <li>Accounts can be created and used to login to the application.</li>
    </ul>
  </li>
  <li> User Login/Authentication
    <ul> 
      <li>Users can login to the application with a username password pair with salts.</li>
    </ul>
  </li>
  <li> Logout </li>
  <li> Itinerary Creation
   <ul> 
      <li>New itineraries can be created with a city, country, start date, end date, budget, collaborator (optional) </li>
     
    </ul>
  </li>
  <li> Itinerary Edit
    <ul> 
      <li> Existing Itineraries of the authenticated user can be modified in the following fields: city, country, start date, end date, budget, collaborator </li>
    </ul>
  </li>
  <li> Itinerary Collaborator Support
    <ul> 
      <li>Collaborators of an itinerary can view and modify the itineraries they have been added as collaborators to. </li>
      <li>Collaborators can only be added successfully if the supplied username of the desired collaborator is a valid existing user. </li>
    </ul>
  </li>
  <li>PWA Format
    <ul> 
      <li>The Full Stack appication is installable on mobile and desktop. </li>
    </ul>
  </li>
  
</ul>

### Incomplete Features: 
<ul>
  <li> Itinerary Activity Add
  <ul> 
      <li>Activities should be able to be added to the schedule component of an itinerary </li>
    </ul>
  </li>
  <li> Friends Search + Add/Remove 
  <ul> 
      <li>Friends should be searchable and addable/removable as friends to a user in the DB to permit them to be added as collaborators. </li>
    </ul>
  </li>
  <li>
    Note: Our team member Sean was tasked with these features but he decided to no longer contribute to the project.
  </li>
</ul>


## Authentication/Authorization Processes 
Authentication is handled via our JWT token middleware that works with cookies. The authentication process utilizes JSON Web Tokens for verifying user identities, checking for tokens in browser cookies or the Authorization header. Tokens are decoded using a secret key (API_SECRET) which allows us to extract user details, serving as the basis for authorization and ensuring only authorized access to our middleware protected routes. User data and session expiry information are securely stored within the JWT. The middleware denies access and returns a 401 status if no valid token is present, ensuring security.Our token generation function involves embedding user details and an expiration time into the JWT. Token invalidation is handled by setting the cookie's expiration to a past date. These measures ensurecontrolled access to the application resources, maintaining user authentication and authorization integrity.

## Caching Strategy 
The caching strategy is employed via our Service Worker. This utilizes a cache-first approach, prioritizing the speed and reliability of content delivery by pre-caching essential static assets during installation. For our dynamic content, particularly API GET requests, it defaults to cache but fetches from the network if necessary, ensuring updated data is served when available. The strategy includes an efficient cleanup process during activation, removing outdated caches to manage storage efficiently and prevent the data from going stale. In instances of network failure, we fallback to serving a pre-cached offline page, maintaining functionality and user interaction. 


## DB Schema 
<img src="https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupD/blob/f407e27683d2fc244f60ecb0fd9fd5436ca72440/FinalProject/charts/ER.png">


A list of all API endpoints with a description of their behavior. If you made changes since the previous milestone, make sure you update this table:
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


A list of all the pages in your app, how to navigate them, and the offline functionality they provide, if any:
#### Pages

* Menu- The landing page after successful login. Can directly navigate to My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* Sign Up- Users can create accounts with their name, username, and password. Can directly navigate to the login page.
* Login/Logout- User inputs username and password, credentials are authenticated, and user gets logged in. Can directly navigate to the sign up page.
* Create New Itinerary- Input the country, city, start/end date, budget, collaborator to create a new itinerary. Can directly navigate to Menu, My Itineraries, Search Activities, Find Friends, and Logout.
* Edit Itinerary- Can be accessed by clicking on an itinerary in the My Itineraries page. Itinerary fields can be edited and updated. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* My Itineraries- Populates a list of the current user's itineraries. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Search Activities, Find Friends, and Logout.
* Search Activities- Has offline functionality. User can search for keywords and activities will be filtered. Can directly navigate to Menu, My Itineraries, Create New Itinerary, Find Friends, and Logout.


Detailed individual team member contributions, including a recap of what each team member did for each milestone:
### Team Member Contributions

#### [Kathryn Lu]
Milestone 1:
* API design, implementation, and testing
* HTML/CSS/Bootstrap Frontend Implementation

Milestone 2:
* User authentication
* Find Friends functionality
* Search activities functionality
* User Database
* Repository Refactor 

Final Project:
* 
*

#### [Sylbi Bae]
Milestone 1:
* API design, implementation, and testing
* HTML/CSS/Bootstrap Frontend Implementation

Milestone 2:
* Create new itinerary functionality
* View itineraries functionality
* Itinerary Database

Final Project:
* Create New Itinerary, Edit Itinerary, My Itineraries fullstack functionality
* Part 2: Offline Functionality
* Part 3: Installable PWA 

#### [Sean Turner]
Milestone 1:
* HTML/CSS/Bootstrap Frontend Implementation

Milestone 2:
* Activities database

Final Project:
* None


#### Project Effort Contribution
Milestone   | Kathryn | Sylbi | Sean
----------- | ------------- | ------------- | --------------
Milestone 1 | 33%            | 33%            | 33%
Milestone 2 | 45%            | 45%            | 10%
Final       | 50%            | 50%            | 0%
----------- | ------------- | ------------- | --------------
TOTAL:      | 128%      | 128%      | 43%
