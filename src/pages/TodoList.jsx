import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import Pagination from '../components/Pagination'
import Navigation from '../components/Navigation'
import { createTodo, deleteTodo } from '../utils/todoApi'

const ITEMS_PER_PAGE = 10

export default function TodoList() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos')
      if (!response.ok) throw new Error('Failed to fetch todos')
      return response.json()
    }
  })

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (old) => [newTodo, ...old])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['todos'], (old) => 
        old.filter(todo => todo.id !== id)
      )
    }
  })

  if (isLoading) return <div className="text-center mt-8">Loading...</div>
  if (error) throw error

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && todo.completed) || 
      (filter === 'active' && !todo.completed)
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE)
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <Navigation />
      </div>

      <TodoForm onSubmit={createMutation.mutate} />
      
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:border-blue-500"
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="space-y-4">
        {paginatedTodos.map(todo => (
          <div key={todo.id} className="flex items-center gap-4">
            <Link to={`/todo/${todo.id}`} className="flex-1">
              <TodoItem todo={todo} />
            </Link>
            <button
              onClick={() => deleteMutation.mutate(todo.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}