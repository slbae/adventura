// Unified error handling function
const handleError = (res) => {
    if (!res.ok) {
        let error = new Error(res.statusText);
        error.status = res.status;
        throw error;
    }
    return res;
};

function checkResponse(res) {
    if (!res.ok) {
        throw new Error("There was an error in fetch");
    }
    return res;
}

// API client with HTTP methods
const APIClient = {
    API_BASE: '/api',

    get: (url) => {
        return fetch(url, {
            headers: {}
        }).then(handleError).then(res => res.json());
    },

    post: (url, data) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => res.json());
    },

    put: (url, data) => {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => res.json());
    },

    delete: (url) => {
        return fetch(url, {
            method: 'DELETE',
            headers: {}
        }).then(handleError).then(res => res.json());
    },

    // Login function using the post method of the HTTP client
    login: (username, password) => {
        const requestData = {
            username: username,
            password: password
        };

        return APIClient.post(APIClient.API_BASE + '/users/login', requestData)
            .then(user => console.log(user))
            .catch(handleError);
    },

    createItinerary: (itinerary) => {
        return APIClient.post(APIClient.API_BASE + '/itinerary', itinerary)
        .then(itinerary => itinerary)
        .catch(handleError);
    },
    viewItineraries: (username) => {
        return APIClient.get(APIClient.API_BASE + '/itineraries')
    },
    getItineraryById: (id) => {
        return APIClient.get(`/api/itineraries/${id}`)
        .then(itinerary => itinerary)
        .catch(handleError);
    },
    getCurrentUser: () => {
        return APIClient.get(APIClient.API_BASE + '/users/me')
        .then(user => user)
        .catch(handleError);
    },
    editItinerary: (itinerary) => {
    
        return fetch(APIClient.API_BASE  + '/itineraries/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itinerary)
        })
            .then(checkResponse)
            .then(res => res.json())
            .then(iti => iti)
            .catch(handleError);
    },
    getUserById: (id) => {
        return APIClient.get(APIClient.API_BASE + '/users/' + id)
        .then(user => user)
        .catch(handleError);
    }

};

export default APIClient;
