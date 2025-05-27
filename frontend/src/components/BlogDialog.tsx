interface BlogDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

const BlogDialog = ({ isOpen, onClose, title, content }: BlogDialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="text-gray-700 text-sm whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  )
}

export default BlogDialog
