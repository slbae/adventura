const db = require('./DBConnection');
const Itinerary = require('./models/Itinerary');

async function getItineraryById(itineraryId) {
    return db.query('SELECT * FROM itinerary WHERE iti_id=?', [itineraryId])
        .then(({ results }) => {
            if (results[0]) {
                console.log("in getItineraryByIdDAO: " + results[0]);
                return new Itinerary(results[0]);
            }
        })
        .catch(err => {
            console.error('Database error in getItineraryById:', err);
            throw err; // Re-throw the error to be handled by the caller
        });
}

function createItinerary(itinerary, callback) {
    const values = [
        itinerary.country,
        itinerary.city,
        itinerary.startdate,
        itinerary.enddate,
        itinerary.author,
        itinerary.budget,
        itinerary.collaborators //singular
        // JSON.stringify(itinerary.collaborators), // Save as a JSON string,
    ];

    db.query(
        'INSERT INTO itinerary (iti_country, iti_city, iti_startdate, iti_enddate, iti_author, iti_budget, iti_collaborator) VALUES (?, ?, ?, ?, ?, ?, ?)',
        values,
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result.insertId); // Pass the new itinerary ID to the callback
        }
    );
}

async function getItinerariesByUserId(userId) {
    try {
        console.log("userId: " + userId);
        // Execute the query and store the result object
        const result = await db.query('SELECT * FROM itinerary WHERE iti_author = ?', [userId]);
        let test = await db.query('SELECT * FROM itinerary');
        test = test.results;
        console.log("All itineraries: " + test.map(row => new Itinerary(test)));
        // Access the 'results' property directly, which is the array of rows
        const rows = result.results;
        console.log("Result: " + result);
        console.log("getItinerariesByUserId: " + rows);

        // Map the rows to create new Itinerary instances
        return rows.map(row => new Itinerary(row));
    } catch (error) {
        console.error('Error getting itineraries by userId:', error);
        throw error;
    }
}

async function updateItinerary(itinerary) {
    console.log("in update itinerary: " + itinerary);
    try {
        // Prepare the query to update the itinerary
        const query = 'UPDATE itinerary SET iti_startdate=?, iti_enddate=?, iti_budget=?, iti_collaborator=? WHERE iti_id=?';

        const collaborator = itinerary.collaborators;
        console.log("oneonone");
        console.log(itinerary.collaborators);
        // Execute the update query
        const result = await db.query(query, [itinerary.startdate, itinerary.enddate, itinerary.budget, collaborator, itinerary.id]);

        if (result.affectedRows === 0) {
            throw new Error(`Itinerary with ID ${itinerary.id} not found`);
        }

        console.log(`Itinerary with ID ${itinerary.id} updated successfully`);
        return true;
    } catch (error) {
        console.error('Error updating itinerary:', error);
        throw error;
    }
}

function getCollaborators(itineraryId) {
    const iti = getItineraryById(itineraryId);
    return JSON.stringify(iti.collaborators);
}

module.exports = {
    getItineraryById,
    createItinerary,
    getItinerariesByUserId,
    updateItinerary,
    getCollaborators
};