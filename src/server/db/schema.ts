import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `jobpilot-ai_${name}`);
export const roleEnum = pgEnum("role", ["user", "assistant"]);
export const typeEnum = pgEnum("type", [
  "text",
  "job-card",
  "career-suggestion",
]);

export const educationLevelEnum = pgEnum("education_level", [
  "High School",
  "D3",
  "S1",
  "S2",
]);

export const careerStatusEnum = pgEnum("career_status", [
  "Fresh Graduate",
  "Student",
  "Working",
  "Career Switcher",
]);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),

  isOnboardingComplete: d.boolean().default(false),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// FEATURES

export const userProfiles = createTable("user_profile", (d) => ({
  userId: d
    .varchar({ length: 255 })
    .primaryKey()
    .references(() => users.id),

  fullName: d.varchar({ length: 255 }),
  age: d.integer(),
  educationLevel: educationLevelEnum("educationLevelEnum").notNull(),
  major: d.varchar({ length: 255 }),
  location: d.varchar({ length: 255 }),

  currentStatus: careerStatusEnum("careerStatusEnum").notNull(),
  pastJobs: d.text(),
  skills: d.text(),

  desiredIndustry: d.varchar({ length: 255 }),
  targetRole: d.varchar({ length: 255 }),
  growthAreas: d.text(),

  chatInitiated: d.boolean().default(false),
  createdAt: d.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const conversations = createTable("conversation", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  title: d.varchar({ length: 255 }).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const messages = createTable("message", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => conversations.id),
  role: roleEnum("role").notNull(),
  type: typeEnum("type").notNull(),
  content: d.text().notNull(),
  createdAt: d.timestamp({ withTimezone: true }).defaultNow().notNull(),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
