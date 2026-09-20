import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(), projectType: text("project_type").notNull(), expertise: text("expertise"), languages: text("languages"), volume: text("volume"), timeline: text("timeline"), sensitivity: text("sensitivity"), budget: text("budget"), name: text("name").notNull(), email: text("email").notNull(), company: text("company").notNull(), role: text("role"), details: text("details").notNull(), attachmentKey: text("attachment_key"), source: text("source"), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull(), country: text("country").notNull(), languages: text("languages").notNull(), education: text("education"), discipline: text("discipline").notNull(), coding: text("coding"), experience: text("experience").notNull(), availability: text("availability").notNull(), profileUrl: text("profile_url"), note: text("note"), cvKey: text("cv_key"), source: text("source"), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
