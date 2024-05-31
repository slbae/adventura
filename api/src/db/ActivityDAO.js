const db = require('./DBConnection');

function getActivities() {
    return db.query('SELECT * FROM activity').then(({ results }) => {
        if (results.length === 0) {
            throw new Error("No activities found");
        }
        return results;
    }).catch(err => {
        throw err;
    });
}
function searchActivities(searchTerm) {
    return db.query(`
      SELECT * FROM activity
      WHERE activity_name LIKE ? OR activity_city LIKE ?`, 
      [`%${searchTerm}%`, `%${searchTerm}%`])
      .then(({ results }) => results)
      .catch(err => {
        throw err;
      });
  }

  function toggleLike(activityId, userId) {
    const query = `
        INSERT INTO activity_likes (activity_id, user_id, liked)
        VALUES (?, ?, TRUE)
        ON DUPLICATE KEY UPDATE liked = NOT liked;
    `;

    return db.query(query, [activityId, userId])
        .then(({ results }) => results)
        .catch(err => {
            throw err;
        });
}


function getActivitiesWithLikes(userId) {
    const query = `
        SELECT a.*,
               (SELECT COUNT(*) FROM activity_likes WHERE activity_id = a.activity_id AND liked) AS like_count,
               EXISTS(SELECT 1 FROM activity_likes WHERE activity_id = a.activity_id AND user_id = ?) AS liked
        FROM activity a
    `;

    return db.query(query, [userId])
        .then(({ results }) => {
            return results.map(activity => {
                activity.liked = !!activity.liked; // Convert to boolean
                activity.like_count = parseInt(activity.like_count, 10); // Ensure it's a number
                return activity;
            });
        }).catch(err => {
            throw err;
        });
}


function searchActivitiesWithLikes(searchTerm, userId) {
    return db.query(`
        SELECT a.*, IF(al.user_id IS NULL, FALSE, TRUE) as liked
        FROM activity a
        LEFT JOIN activity_likes al ON a.activity_id = al.activity_id AND al.user_id = ?
        WHERE a.activity_name LIKE ? OR a.activity_city LIKE ?`,
        [userId, `%${searchTerm}%`, `%${searchTerm}%`])
        .then(({ results }) => {
            return results.map(activity => {
                activity.liked = !!activity.liked;
                return activity;
            });
        }).catch(err => {
            throw err;
        });
}

async function toggleLikeStatus(activityId, userId) {
    let connection;
    try {
        await db.query('START TRANSACTION');

        // Toggle the like state
        await db.query(`
            INSERT INTO activity_likes (activity_id, user_id, liked)
            VALUES (?, ?, TRUE)
            ON DUPLICATE KEY UPDATE liked = NOT liked;
        `, [activityId, userId]);

        // Conditional update for like_count based on whether the operation was a like or unlike
        await db.query(`
            UPDATE activity
            SET like_count = like_count + IF(
                (SELECT liked FROM activity_likes WHERE activity_id = ? AND user_id = ?) = TRUE,
                1, -1
            )
            WHERE activity_id = ?;
        `, [activityId, userId, activityId]);

        // Commit the transaction
        await db.query('COMMIT');

        // Retrieve the new like count to return
        const result = await db.query('SELECT like_count FROM activity WHERE activity_id = ?', [activityId]);

        // Properly verify the returned structure from db.query
        if (!result || !result.results || result.results.length === 0) {
            throw new Error("No activity found for the given ID");
        }

        // Access the like_count correctly based on the structure of your database response
        const likeCount = result.results[0].like_count;

        return likeCount;
    } catch (err) {
        // Rollback the transaction in case of an error
        await db.query('ROLLBACK');
        throw err; // Rethrow the error for handling up the chain
    }
}

module.exports = {
    getActivities,
    searchActivities,
    toggleLike,
    getActivitiesWithLikes,
    searchActivitiesWithLikes,
    toggleLikeStatus
}; 