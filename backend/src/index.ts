import { Context, Hono } from 'hono'
import { authRoutes } from './routes/auth.routes'
import { blogRoutes } from './routes/blog.routes'
import { cors } from 'hono/cors'

const app = new Hono<{
	Bindings: {
		PRISMA_ACCELERATE_URL: string,
		JWT_SECRET: string,
	}
}>();

const allowedOrigins = [
  'http://localhost:5173'
]

app.use('/*', cors({
  origin: (origin) => {
    if (!origin) return '';
    if (allowedOrigins.includes(origin)) return origin;
    return '';
  },
  credentials: true,
	allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
 	exposeHeaders: ['Content-Type'],
  	maxAge: 86400
}))

app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/blog', blogRoutes)

export default app