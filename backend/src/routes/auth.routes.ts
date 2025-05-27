import { Hono } from 'hono'
import { signupHandler ,signinHandler, logoutHandler, getSessionHandler } from '../controllers/auth.controllers'
import { authMiddleware } from '../middlewares/auth.middlewares'

export const authRoutes = new Hono()

authRoutes.post('/signup', signupHandler)
authRoutes.post('/signin', signinHandler)
authRoutes.get('/signout', logoutHandler)
//authRoutes.get('/session', authMiddleware, getSessionHandler)
authRoutes.get('/session', getSessionHandler)