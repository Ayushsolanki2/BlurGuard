import { pgTable, text, timestamp, boolean, integer, serial } from 'drizzle-orm/pg-core';

export const usageLogs = pgTable('usage_logs', {
  id: serial('id').primaryKey(),
  appName: text('app_name').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  category: text('category').default('general').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  focusMode: boolean('focus_mode').default(false).notNull(),
  dailyLimitMinutes: integer('daily_limit_minutes').default(120).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const focusSessions = pgTable('focus_sessions', {
  id: serial('id').primaryKey(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  durationMinutes: integer('duration_minutes'),
});

export const productivityScores = pgTable('productivity_scores', {
  id: serial('id').primaryKey(),
  score: integer('score').notNull(),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
