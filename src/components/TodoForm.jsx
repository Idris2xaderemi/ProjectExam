import React, { useState } from 'react'

export default function TodoForm({ onSubmit, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title..."
          className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {initialData ? 'Update' : 'Add'} Todo
        </button>
      </div>
    </form>
  )
}