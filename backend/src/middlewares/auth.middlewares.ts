import { getCookie } from 'hono/cookie'
import { MiddlewareHandler } from 'hono'
import { jwtVerify } from 'jose'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, 'token')
  const secret = c.env.JWT_SECRET

  if (!token || !secret) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )

    c.set('userId', payload.userId) // Pass userId to route
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
}
