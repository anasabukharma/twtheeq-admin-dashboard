ALTER TABLE `visitors` ADD `ipAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `visitors` ADD `browser` varchar(128);--> statement-breakpoint
ALTER TABLE `visitors` ADD `browserVersion` varchar(32);--> statement-breakpoint
ALTER TABLE `visitors` ADD `os` varchar(64);--> statement-breakpoint
ALTER TABLE `visitors` ADD `osVersion` varchar(32);--> statement-breakpoint
ALTER TABLE `visitors` ADD `device` varchar(64);--> statement-breakpoint
ALTER TABLE `visitors` ADD `deviceModel` varchar(128);--> statement-breakpoint
ALTER TABLE `visitors` ADD `country` varchar(64);--> statement-breakpoint
ALTER TABLE `visitors` ADD `countryCode` varchar(2);--> statement-breakpoint
ALTER TABLE `visitors` ADD `city` varchar(128);--> statement-breakpoint
ALTER TABLE `visitors` ADD `userAgent` text;