import { z } from 'zod'

export const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  subject: z.string().min(1, 'Subject is required').trim(),
  message: z.string().min(1, 'Message is required').trim(),
})

export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  excerpt: z.string().trim(),
  coverImage: z.string().url().or(z.literal('')),
  tags: z.array(z.string()),
  body: z.string(),
  published: z.boolean(),
})

export const ServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().trim(),
  duration: z.string().trim(),
  price: z.string().trim(),
  bookingLink: z.string().trim(),
  active: z.boolean(),
})

export type ContactInput = z.infer<typeof ContactSchema>
export type PostInput = z.infer<typeof PostSchema>
export type ServiceInput = z.infer<typeof ServiceSchema>
