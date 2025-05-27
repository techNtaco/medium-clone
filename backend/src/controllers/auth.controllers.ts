import { Context } from 'hono'
import bcrypt from 'bcryptjs'
import { signupSchema, signinSchema } from '@teamaccess2024/medium-common'
import { SignJWT } from 'jose'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { getPrisma } from '../lib/prisma'

export const signupHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const body = await c.req.json()
  const parsed = signupSchema.safeParse(body)

  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)

  const { email, password, username } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return c.json({ error: 'Email already in use' }, 409)

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashed, name: username },
  })

  return c.json({
    message: 'Signup successful. Please login to continue.',
    user: { id: user.id, email: user.email, username },
  })
}

// export const signinHandler = async (c: Context) => {
//   const isProd = c.env.ENV === 'production'
//   const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
//   const JWT_SECRET = c.env.JWT_SECRET
//   if (!JWT_SECRET) return c.json({ error: 'JWT_SECRET not defined' }, 500)

//   const body = await c.req.json()
//   const parsed = signinSchema.safeParse(body)
//   if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)

//   const { email, password } = parsed.data

//   const user = await prisma.user.findUnique({ where: { email } })
//   if (!user) return c.json({ error: 'Invalid credentials' }, 401)

//   const valid = await bcrypt.compare(password, user.password)
//   if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

//   let token: string
//   try {
//     token = await new SignJWT({ userId: user.id })
//       .setProtectedHeader({ alg: 'HS256' })
//       .setExpirationTime('7d')
//       .sign(new TextEncoder().encode(JWT_SECRET))
//   } catch (err) {
//     return c.json({ error: 'Failed to generate token' }, 500)
//   }

//   setCookie(c, 'token', token, {
//     httpOnly: isProd,
//     secure: isProd, // ✅ true on Cloudflare
//     sameSite: isProd ? 'None' : 'Lax',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7,
//   })

//   return c.json({
//     message: 'Signin successful',
//     user: { id: user.id, email: user.email, username: user.name },
//   })
// }

export const signinHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const JWT_SECRET = c.env.JWT_SECRET
  if (!JWT_SECRET) {
    return c.json({ error: 'JWT_SECRET not defined' }, 500)
  }

  // parse + validate incoming body
  const body = await c.req.json()
  const parsed = signinSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400)
  }
  const { email, password } = parsed.data

  // look up user & verify
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // issue a JWT
  let token: string
  try {
    token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET))
  } catch (err) {
    return c.json({ error: 'Failed to generate token' }, 500)
  }

  // respond with the token & user info
  return c.json({
    message: 'Signin successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.name,
    },
  })
}

export const getSessionHandler = async (c: Context) => {
  const userId = c.get('userId')
  return c.json({ user: { id: userId } })
}

// export const logoutHandler = async (c: Context) => {
//   deleteCookie(c, 'token')
//   return c.json({ message: 'Logged out successfully' })
// }