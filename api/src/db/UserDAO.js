const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

function getUserByCredentials(username, password) {
    return db.query('SELECT * FROM user WHERE usr_username = ?', [username])
        .then(({ results }) => {
            if (results.length === 0) {
                // User does not exist
                throw new Error("No such user");
            }
            const user = new User(results[0]);
            return user.validatePassword(password)
                .then(() => user) // Return the user object on successful password validation
                .catch(err => {
                    // Handle password validation failure
                    throw new Error("Invalid password");
                });
        });
}

function getUserByUsername(username) {
    return db.query('SELECT * FROM user WHERE usr_username = ?', [username])
        .then(({ results }) => {
            if (results.length === 0) {
                throw new Error("User not found");
            }
            return new User(results[0]);
        })
        .catch(err => {
            throw err;
        });
}

function getUserFriends(userId) {
    return db.query(`
      SELECT u.usr_id, u.usr_first_name, u.usr_last_name, u.usr_username, u.usr_avatar 
      FROM friendships f
      INNER JOIN user u ON u.usr_id = f.friend_id
      WHERE f.user_id = ?
    `, [userId])
        .then(({ results }) => {
            if (!results) {
                throw new Error("No friends found");
            }
            // Assuming results is an array of user objects
            return results;
        })
        .catch(err => {
            // Handle any errors that might occur during the query
            throw err;
        });
}

function createUser(firstName, lastName, username, avatar, password) {
    const salt = User.generateSalt();
    return User.hashPassword(password, salt).then(hashedPassword => {
        const insertQuery = `
        INSERT INTO user (usr_first_name, usr_last_name, usr_username, usr_avatar, usr_salt, usr_password)
        VALUES (?, ?, ?, ?, ?, ?)`;
        return db.query(insertQuery, [firstName, lastName, username, avatar, salt, hashedPassword])
            .then(({ results }) => {
                return { usr_id: results.insertId }; // Return the new user's ID
            });
    });
}

function searchByUsername(username) {
    return db.query('SELECT usr_id, usr_first_name, usr_last_name FROM user WHERE usr_username LIKE ?', [`%${username}%`])
        .then(({ results }) => {
            return results; // Assuming 'results' is an array of user objects
        })
        .catch(err => {
            throw err;
        });
}

function checkFriendship(userId, friendId) {
    return db.query('SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?', [userId, friendId])
        .then(({ results }) => {
            return results.length > 0;
        })
        .catch(err => {
            throw err;
        });
}

function addFriend(userId, friendId) {
    return db.query('INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)', [userId, friendId])
        .then(({ results }) => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

async function removeFriend(userId, friendId) {
    // Assuming symmetric friendship (if A is a friend of B, B is a friend of A)
    const query = 'DELETE FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)';
    const values = [userId, friendId, friendId, userId];
    try {
        await db.query(query, values);
    } catch (err) {
        throw err;
    }
}

async function getUserById(userId) {
    return db.query('SELECT * from user WHERE usr_id=?', [userId])
        .then(({ results }) => {
            if (results[0])
                return new User(results[0]);
        })
        .catch(err => {
            throw err;
        });
}

module.exports = {
    getUserByCredentials,
    getUserFriends,
    createUser,
    searchByUsername,
    checkFriendship,
    addFriend,
    removeFriend,
    getUserByUsername,
    getUserById
};


