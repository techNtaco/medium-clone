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

app.use('/*', cors())

app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/blog', blogRoutes)

export default app