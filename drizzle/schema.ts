import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Visitors table for tracking all visitor data
export const visitors = mysqlTable("visitors", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull().unique(),
  
  // Connection status
  isOnline: int("isOnline").default(0).notNull(),
  lastSeen: timestamp("lastSeen").defaultNow().notNull(),
  
  // Read/Unread status
  isRead: int("isRead").default(0).notNull(),
  isFavorite: int("isFavorite").default(0).notNull(),
  
  // Current page tracking
  currentPage: varchar("currentPage", { length: 64 }),
  
  // Technical information
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv6 support
  browser: varchar("browser", { length: 128 }),
  browserVersion: varchar("browserVersion", { length: 32 }),
  os: varchar("os", { length: 64 }),
  osVersion: varchar("osVersion", { length: 32 }),
  device: varchar("device", { length: 64 }), // Desktop, Mobile, Tablet
  deviceModel: varchar("deviceModel", { length: 128 }),
  country: varchar("country", { length: 64 }),
  countryCode: varchar("countryCode", { length: 2 }),
  city: varchar("city", { length: 128 }),
  userAgent: text("userAgent"),
  
  // All visitor data stored as JSON
  formData: text("formData"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = typeof visitors.$inferInsert;