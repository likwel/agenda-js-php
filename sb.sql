CREATE TABLE `agenda1` (
  `id` int(11) Auto_increment,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `from_date` datetime NOT NULL,
  `to_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `lat` float NOT NULL DEFAULT 0,
  `lng` float NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY(id),
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES User(id)
  ON DELETE CASCADE
   ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;