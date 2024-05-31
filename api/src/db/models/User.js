const crypto = require('crypto');
const { query } = require('../DBConnection');

module.exports = class User {
    id = null;
    first_name = null;
    last_name = null;
    username = null;
    avatar = null;
    #passwordHash = null;
    #salt = null;

    constructor(data) {
        this.id = data.usr_id;
        this.first_name = data.usr_first_name;
        this.last_name = data.usr_last_name;
        this.username = data.usr_username;
        this.avatar = data.usr_avatar;
        this.#salt = data.usr_salt;
        this.#passwordHash = data.usr_password;
    }

    static hashPassword(password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    }

    static generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    static async create(data) {
        const salt = User.generateSalt();
        const passwordHash = await User.hashPassword(data.password, salt);
        const insertQuery = `INSERT INTO user (usr_first_name, usr_last_name, usr_username, usr_avatar, usr_salt, usr_password) VALUES (?, ?, ?, ?, ?, ?)`;

        return query(insertQuery, [data.first_name, data.last_name, data.username, data.avatar, salt, passwordHash])
            .then(result => {
                return new User({ ...data, usr_id: result.results.insertId, usr_salt: salt, usr_password: passwordHash });
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    static async findByUsername(username) {
        const selectQuery = `SELECT * FROM user WHERE usr_username = ? LIMIT 1`;

        return query(selectQuery, [username])
            .then(result => {
                if (result.results.length > 0) {
                    return new User(result.results[0]);
                } else {
                    return null;
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    validatePassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(new Error("An error occurred during password validation."));
                } else {
                    const digest = derivedKey.toString('hex');
                    if (this.#passwordHash === digest) {
                        resolve(this);
                    } else {
                        reject(new Error("Invalid username or password"));
                    }
                }
            });
        });
    }

    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            avatar: this.avatar
        };
    }

};
