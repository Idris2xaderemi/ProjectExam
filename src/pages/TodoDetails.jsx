import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTodoStatus, updateTodo } from '../utils/todoApi'
import StatusButton from '../components/StatusButton'
import EditTodo from '../components/EditTodo'

export default function TodoDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          navigate('/404')
          return null
        }
        throw new Error('Failed to fetch todo')
      }
      return response.json()
    }
  })

  const toggleMutation = useMutation({
    mutationFn: () => updateTodoStatus(id, !todo.completed),
    onSuccess: (updatedTodo) => {
      // Update both the individual todo and the todos list cache
      queryClient.setQueryData(['todo', id], updatedTodo)
      queryClient.setQueryData(['todos'], (oldTodos) => {
        if (!oldTodos) return oldTodos
        return oldTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      })
    }
  })

  const editMutation = useMutation({
    mutationFn: (updates) => updateTodo(id, updates),
    onSuccess: (updatedTodo) => {
      // Update both caches after editing
      queryClient.setQueryData(['todo', id], updatedTodo)
      queryClient.setQueryData(['todos'], (oldTodos) => {
        if (!oldTodos) return oldTodos
        return oldTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      })
      setIsEditing(false)
    }
  })

  if (isLoading) return <div className="text-center mt-8">Loading...</div>
  if (error) throw error
  if (!todo) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back to List
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Todo Details</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <EditTodo
            todo={todo}
            onSubmit={editMutation.mutate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p className="mb-4"><strong>Title:</strong> {todo.title}</p>
            <p className="mb-4">
              <strong>Status:</strong>{' '}
              <span className={todo.completed ? 'text-green-600' : 'text-yellow-600'}>
                {todo.completed ? 'Completed' : 'Active'}
              </span>
            </p>
            <StatusButton
              completed={todo.completed}
              isPending={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate()}
            />
          </>
        )}
      </div>
    </div>
  )
}