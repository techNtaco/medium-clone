import { useState } from 'react'

interface CreateBlogDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, content: string) => void
}

const CreateBlogDialog = ({ isOpen, onClose, onSubmit }: CreateBlogDialogProps) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white max-w-3xl w-full p-10 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create Blog</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="space-y-6">
          <input
            type="text"
            className="w-full border border-gray-300 px-5 py-3 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 px-5 py-3 rounded-md text-base h-52 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-base font-medium transition"
            onClick={() => {
              onSubmit(title, content)
              onClose()
            }}
            disabled={!title.trim() || !content.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBlogDialog
