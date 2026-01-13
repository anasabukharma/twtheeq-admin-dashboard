CREATE TABLE `visitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`isOnline` int NOT NULL DEFAULT 0,
	`lastSeen` timestamp NOT NULL DEFAULT (now()),
	`isRead` int NOT NULL DEFAULT 0,
	`isFavorite` int NOT NULL DEFAULT 0,
	`currentPage` varchar(64),
	`formData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitors_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitors_sessionId_unique` UNIQUE(`sessionId`)
);
