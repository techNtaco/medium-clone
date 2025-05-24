import { Hono } from 'hono'
import { signupHandler ,signinHandler, logoutHandler } from '../controllers/auth.controllers'

export const authRoutes = new Hono()

authRoutes.post('/signup', signupHandler)
authRoutes.post('/signin', signinHandler)
authRoutes.get('/signout', logoutHandler)