import { getCookie } from 'hono/cookie'
import { MiddlewareHandler } from 'hono'
import { jwtVerify } from 'jose'

// export const authMiddleware: MiddlewareHandler = async (c, next) => {
//   const token = getCookie(c, 'token') // Get the token from cookies
//   const secret = c.env.JWT_SECRET
//   console.log('Token:', token)
//   console.log('Secret:', secret)
//   console.log(c.req.header('cookie'))
//   if (!token || !secret) return c.json({ error: 'Unauthorized' }, 401)

//   try {
//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(secret)
//     )

//     c.set('userId', payload.userId) // Pass userId to route
//     await next()
//   } catch {
//     return c.json({ error: 'Invalid token' }, 401)
//   }
// }

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  // 1. Grab the Authorization header
  const authHeader = c.req.header('Authorization') || c.req.header('authorization')
  console.log('Authorization Header:', authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // 2. Extract the token part
  const token = authHeader.split(' ')[1]
  const secret = c.env.JWT_SECRET
  if (!secret) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    // 3. Verify the JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )

    // 4. Attach the userId to the context and continue
    c.set('userId', (payload as any).userId)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}