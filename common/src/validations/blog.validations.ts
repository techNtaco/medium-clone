import { z } from 'zod'

export const createBlogSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
})

export const updateBlogSchema = createBlogSchema.extend({
  id: z.string().uuid(),
})

export const blogPaginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>
