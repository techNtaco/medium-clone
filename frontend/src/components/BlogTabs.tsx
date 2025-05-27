import { useState, useEffect } from 'react'
import CreateBlogDialog from './CreateBlogDialog'
import BlogCard from './BlogCard'
import { API_BASE_URL } from '../utils/api'

interface Blog {
    id: string,
    title: string,
    content: string,
    authorId: string,
}

const BlogTabs = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'yours'>('all')
  const [blogs, setBlogs] = useState([])
  const [openCreate, setOpenCreate] = useState(false)

const fetchBlogs = async () => {
  const url = activeTab === 'all' ? '/blogs' : '/userBlogs'
  const fullUrl = `${API_BASE_URL}/api/v1/blog${url}`
  const res = await fetch(fullUrl, {
    credentials: 'include',
  })
  const data = await res.json()
  setBlogs(data.blogs)
}

  useEffect(() => {
    fetchBlogs()
  }, [activeTab])

  const handleCreate = async (title: string, content: string) => {
    await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })

    fetchBlogs()
  }

  return (
    <div className="w-full mt-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6">
          <button
            className={`text-sm font-medium pb-1 ${
              activeTab === 'all'
                ? 'text-gray-900 border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Blogs
          </button>
          <button
            className={`text-sm font-medium pb-1 ${
              activeTab === 'yours'
                ? 'text-gray-900 border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('yours')}
          >
            Your Blogs
          </button>
        </div>
        <button
          className="text-sm font-medium text-white bg-black px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => setOpenCreate(true)}
        >
          Create Blog
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
        {blogs.map((blog: Blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      <CreateBlogDialog
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}

export default BlogTabs
