import { useState } from 'react'
import BlogDialog from './BlogDialog'

interface Blog {
  id: string
  title: string
  content: string
  authorId: string
}

const BlogCard = ({ blog }: { blog: Blog }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border p-4 rounded shadow-sm">
        <div
          className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {blog.title}
        </div>
        <div className="text-sm text-gray-700 mt-1">
          {blog.content.length > 100
            ? blog.content.slice(0, 100) + '...'
            : blog.content}
        </div>
      </div>

      <BlogDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={blog.title}
        content={blog.content}
      />
    </>
  )
}

export default BlogCard
