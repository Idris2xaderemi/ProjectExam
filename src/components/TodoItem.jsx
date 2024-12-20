import React from 'react'

export default function TodoItem({ todo }) {
  return (
    <div className={`p-4 border rounded hover:bg-gray-50 ${
      todo.completed ? 'bg-green-50' : 'bg-white'
    }`}>
      <h3 className="font-medium">
        {todo.title}
      </h3>
      <p className={`text-sm ${
        todo.completed ? 'text-green-600' : 'text-gray-500'
      }`}>
        {todo.completed ? 'Completed' : 'Active'}
      </p>
    </div>
  )
}