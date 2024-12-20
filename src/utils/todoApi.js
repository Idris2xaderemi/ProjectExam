const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'

export const createTodo = async ({ title }) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      completed: false,
      userId: 1
    })
  })
  
  if (!response.ok) throw new Error('Failed to create todo')
  
  const data = await response.json()
  return {
    ...data,
    id: Date.now() // Ensure unique ID for JSONPlaceholder
  }
}

export const updateTodoStatus = async (id, completed) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  })
  
  if (!response.ok) {
    throw new Error('Failed to update todo status')
  }
  
  // Return the updated todo with the new completed status
  // Since JSONPlaceholder doesn't actually update the data, we construct the response
  return {
    id: parseInt(id),
    completed: completed, // Use the new completed status
    title: (await response.json()).title // Keep the existing title
  }
}

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  
  if (!response.ok) throw new Error('Failed to update todo')
  
  // Since JSONPlaceholder doesn't persist updates, construct the response
  return {
    id: parseInt(id),
    ...updates,
    completed: updates.completed !== undefined ? updates.completed : false
  }
}

export const deleteTodo = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) throw new Error('Failed to delete todo')
  return id
}