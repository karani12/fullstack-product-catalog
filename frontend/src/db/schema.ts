import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock_qty: integer('stock_qty').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  reviewer_name: varchar('reviewer_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  body: text('body').notNull(),
  is_approved: boolean('is_approved').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export type Category = InferSelectModel<typeof categories>
export type InsertCategory = InferInsertModel<typeof categories>

export type Product = InferSelectModel<typeof products>
export type InsertProduct = InferInsertModel<typeof products>

export type Review = InferSelectModel<typeof reviews>
export type InsertReview = InferInsertModel<typeof reviews>
