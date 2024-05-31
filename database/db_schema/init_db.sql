CREATE DATABASE IF NOT EXISTS `adventura`;
USE `adventura`;

-- Table creation for 'user'
CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usr_first_name` VARCHAR(100) NOT NULL,
  `usr_last_name` VARCHAR(100) NOT NULL,
  `usr_username` VARCHAR(150) NOT NULL UNIQUE,
  `usr_avatar` VARCHAR(255) NOT NULL,
  `usr_salt` VARCHAR(100) NOT NULL,
  `usr_password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table creation for 'friendships'
CREATE TABLE IF NOT EXISTS `friendships` (
  `user_id` INT(11) UNSIGNED NOT NULL,
  `friend_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `friend_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_friend` FOREIGN KEY (`friend_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table creation for 'activity'
CREATE TABLE IF NOT EXISTS `activity` (
 `activity_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
 `activity_name` varchar(100) NOT NULL,
 `activity_price` FLOAT NOT NULL,
 `activity_city` varchar(40) NOT NULL,
 PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table creation for 'itinerary'
CREATE TABLE IF NOT EXISTS `itinerary` (
  `iti_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `iti_country` varchar(100) NOT NULL,
  `iti_city` varchar(100) NOT NULL,
  `iti_startdate` varchar(100) NOT NULL,
  `iti_enddate` varchar(100) NOT NULL,
  `iti_author` INT(11) UNSIGNED NOT NULL,
  `iti_budget` int(10) NOT NULL,
  `iti_collaborator` varchar(100),
  `iti_schedule` json,
  PRIMARY KEY (`iti_id`),
  FOREIGN KEY (`iti_author`) REFERENCES `user`(`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seeding users
INSERT INTO `user` (usr_id, usr_first_name, usr_last_name, usr_username, usr_avatar, usr_salt, usr_password) VALUES
(1, 'Stu', 'Dent', 'student', 'https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1', '48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9', '83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4'),
(2, 'Gra', 'Duate', 'graduate', 'https://robohash.org/nullaautemin.png?size=64x64&set=set1', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a'),
(3, 'Good', 'Sir', 'goodsir', 'https://robohash.org/hicetminus.png?size=64x64&set=set1', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a');

-- Seeding activities 
INSERT INTO `activity` (activity_id, activity_name, activity_price, activity_city) VALUES
(1, 'Tour of Buckingham Palace ', 75.0, 'London'),
(2, 'Museum of Modern Art', 5.0, 'New York'),
(3, 'Statue Of Liberty Ferry Ride', 100.0, 'New York'),
(4, 'London Eye', 50.0, 'London'),
(5, 'Eiffel Tower Visit', 25.0, 'Paris'),
(6, 'Louvre Museum Tour', 15.0, 'Paris'),
(7, 'Venice Gondola Ride', 80.0, 'Venice'),
(8, 'Colosseum Tour', 12.0, 'Rome'),
(9, 'Prague Castle Tour', 10.0, 'Prague'),
(10, 'Safari in Kruger National Park', 300.0, 'Johannesburg'),
(11, 'Cape Point Nature Reserve Visit', 50.0, 'Cape Town'),
(12, 'Sydney Opera House Tour', 40.0, 'Sydney'),
(13, 'Great Barrier Reef Snorkeling', 250.0, 'Cairns'),
(14, 'Mt. Fuji Hiking Tour', 100.0, 'Tokyo'),
(15, 'Golden Gate Bridge Bike Tour', 30.0, 'San Francisco'),
(16, 'Alcatraz Island Visit', 38.0, 'San Francisco'),
(17, 'Banff National Park Tour', 70.0, 'Calgary'),
(18, 'Niagara Falls Boat Tour', 25.0, 'Toronto'),
(19, 'Grand Canyon Helicopter Tour', 300.0, 'Las Vegas'),
(20, 'Walt Disney World Day Pass', 109.0, 'Orlando'),
(21, 'Statue of Christ the Redeemer Visit', 20.0, 'Rio de Janeiro'),
(22, 'Machu Picchu Trek', 50.0, 'Cusco'),
(23, 'Pyramids of Giza Tour', 40.0, 'Cairo'),
(24, 'Northern Lights Viewing Tour', 150.0, 'Reykjavik');

-- Seeding itineraries tentatively refactored the collaborators format
DELETE FROM `itinerary`;
INSERT INTO `itinerary` (`iti_country`, `iti_city`, `iti_startdate`, `iti_enddate`, `iti_author`, `iti_budget`, `iti_collaborator`, `iti_schedule`) VALUES
('France', 'Paris', '2024-01-01', '2024-02-02', 2, 1000, 'student', '{"day1": "Event 1", "day2": "Event 2"}'),
('Greece', 'Athens', '2024-03-01', '2024-04-02', 3, 2000, 'goodsir', '{"day1": "Event 3", "day2": "Event 4"}'),
('USA', 'New York', '2024-02-01', '2024-03-02', 1, 3000, 'graduate', '{"day1": "Event 4", "day2": "Event 1"}');

-- Like Activities 
CREATE TABLE IF NOT EXISTS activity_likes (
  activity_id INT(11) UNSIGNED NOT NULL,
  user_id INT(11) UNSIGNED NOT NULL,
  liked BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (activity_id, user_id),
  CONSTRAINT fk_activity_likes_activity FOREIGN KEY (activity_id) REFERENCES activity(activity_id),
  CONSTRAINT fk_activity_likes_user FOREIGN KEY (user_id) REFERENCES user(usr_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add like_count column to the 'activity' table
ALTER TABLE `activity`
ADD COLUMN `like_count` INT UNSIGNED NOT NULL DEFAULT 0;