import { Hono } from 'hono'
import {
  getBlogHandler,
  getBlogsHandler,
  createBlogHandler,
  updateBlogHandler
} from '../controllers/blog.controllers'
import { authMiddleware } from '../middlewares/auth.middlewares'

export const blogRoutes = new Hono()

blogRoutes.get('/blog/:id', getBlogHandler)
blogRoutes.get('/blogs', getBlogsHandler)

// Protected routes
blogRoutes.post('/blog', authMiddleware, createBlogHandler)
blogRoutes.put('/blog', authMiddleware, updateBlogHandler)
