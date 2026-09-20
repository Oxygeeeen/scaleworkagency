CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`country` text NOT NULL,
	`languages` text NOT NULL,
	`education` text,
	`discipline` text NOT NULL,
	`coding` text,
	`experience` text NOT NULL,
	`availability` text NOT NULL,
	`profile_url` text,
	`note` text,
	`cv_key` text,
	`source` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`project_type` text NOT NULL,
	`expertise` text,
	`languages` text,
	`volume` text,
	`timeline` text,
	`sensitivity` text,
	`budget` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text NOT NULL,
	`role` text,
	`details` text NOT NULL,
	`attachment_key` text,
	`source` text,
	`created_at` text NOT NULL
);
