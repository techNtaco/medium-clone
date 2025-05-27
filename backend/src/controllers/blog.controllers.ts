import { Context } from 'hono'
import { createBlogSchema, updateBlogSchema, blogPaginationSchema } from '@teamaccess2024/medium-common'
import { getPrisma } from '../lib/prisma'

export const getBlogHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const id = c.req.param('id')
  const blog = await prisma.post.findUnique({ where: { id } })
  return blog ? c.json(blog) : c.json({ error: 'Not found' }, 404)
}

export const getBlogsHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const query = blogPaginationSchema.safeParse(c.req.query())
  if (!query.success) return c.json({ error: query.error.format() }, 400)

  const page = parseInt(query.data.page || '1')
  const limit = parseInt(query.data.limit || '10')
  const skip = (page - 1) * limit

  const blogs = await prisma.post.findMany({
    skip,
    take: limit,
    orderBy: { id: 'desc' },
  })

  return c.json({ page, limit, blogs })
}

export const createBlogHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const body = await c.req.json()
  const parsed = createBlogSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)

  const userId = c.get('userId')
  const blog = await prisma.post.create({
    data: {
      ...parsed.data,
      authorId: userId,
      published: true,
    },
  })

  return c.json(blog)
}

export const updateBlogHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const body = await c.req.json()
  const parsed = updateBlogSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)

  const userId = c.get('userId')

  const blog = await prisma.post.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: userId,
    },
  })

  return c.json(blog)
}

export const getUserBlogsHandler = async (c: Context) => {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  const userId = c.get('userId')
  console.log('User ID:', userId)
  const query = blogPaginationSchema.safeParse(c.req.query())
  if (!query.success) return c.json({ error: query.error.format() }, 400)

  const page = parseInt(query.data.page || '1')
  const limit = parseInt(query.data.limit || '10')
  const skip = (page - 1) * limit

  const blogs = await prisma.post.findMany({
    where: { authorId: userId },
    skip,
    take: limit,
    orderBy: { id: 'desc' },
  })
  console.log('Fetched blogs:', blogs)
  return c.json({ page, limit, blogs })
}