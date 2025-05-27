import { Hono } from 'hono'
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
  'http://localhost:5173',
  'https://medium-clone-f1kn.vercel.app'
]

// app.use('/*', cors({
//   origin: (origin) => {
//     if (!origin) return '';
//     if (allowedOrigins.includes(origin)) return origin;
//     return '';
//   },
//   credentials: true,
// 	allowHeaders: ['Content-Type', 'Authorization'],
//   allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
//   maxAge: 86400
// }))

app.use('/*', cors({
  origin: (origin) => {
    if (!origin) return '';
    if (allowedOrigins.includes(origin)) return origin;
    return '';
  },
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization']
}))

// ensure OPTIONS preflight is handled:
app.options('/*', cors({
  origin: (origin) => {
    if (!origin) return '';
    if (allowedOrigins.includes(origin)) return origin;
    return '';
  },
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization']
}))

app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/blog', blogRoutes)

export default app