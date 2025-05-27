import { useState } from 'react'
import { API_BASE_URL } from '../utils/api'

interface CreateBlogDialogProps {
  isOpen: boolean
  onClose: () => void
}


const CreateBlogDialog = ({ isOpen, onClose }: CreateBlogDialogProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const resp = await fetch(`${API_BASE_URL}/api/v1/blog/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}))
        throw new Error(
          typeof errData.error === 'string'
            ? errData.error
            : `Create failed (${resp.status})`
        )
      }

      // success — clear inputs, close dialog
      setTitle('')
      setContent('')
      onClose()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white max-w-3xl w-full p-10 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create Blog</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full border border-gray-300 px-5 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <textarea
            className="w-full border border-gray-300 px-5 py-3 rounded-md h-48 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBlogDialog
