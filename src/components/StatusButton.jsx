import React from 'react'

export default function StatusButton({ completed, isPending, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        completed ? 'bg-yellow-500' : 'bg-green-500'
      } text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
      disabled={isPending}
    >
      {isPending ? 'Updating...' : 
        completed ? 'Mark as Active' : 'Mark as Completed'}
    </button>
  )
}