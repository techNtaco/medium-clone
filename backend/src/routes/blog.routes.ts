import { Hono } from 'hono'
import {
  getBlogHandler,
  getBlogsHandler,
  createBlogHandler,
  updateBlogHandler,
  getUserBlogsHandler
} from '../controllers/blog.controllers'
import { authMiddleware } from '../middlewares/auth.middlewares'

export const blogRoutes = new Hono()

// Protected routes
blogRoutes.post('/blog', authMiddleware, createBlogHandler)
blogRoutes.put('/blog', authMiddleware, updateBlogHandler)
blogRoutes.get('/blog/:id', authMiddleware, getBlogHandler)
blogRoutes.get('/blogs', authMiddleware, getBlogsHandler)
blogRoutes.get('/userBlogs', authMiddleware, getUserBlogsHandler)
// blogRoutes.post('/blog', createBlogHandler)
// blogRoutes.put('/blog', updateBlogHandler)
// blogRoutes.get('/blog/:id', getBlogHandler)
// blogRoutes.get('/blogs', getBlogsHandler)
// blogRoutes.get('/userBlogs', getUserBlogsHandler)