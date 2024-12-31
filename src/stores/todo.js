import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { todoApi } from '../services/api'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const filter = ref('all')
  const loading = ref(false)
  const error = ref(null)

  // 获取所有待办事项
  const fetchTodos = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.getTodos()
      if (response.success) {
        todos.value = response.data
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      error.value = err.message
      console.error('获取待办事项失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 添加新的待办事项
  const addTodo = async (text) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.addTodo(text)
      if (response.success) {
        todos.value.push(response.data)
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      error.value = err.message
      console.error('添加待办事项失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 切换待办事项状态
  const toggleTodo = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.updateTodo(id)
      if (response.success) {
        const index = todos.value.findIndex(todo => todo._id === id)
        if (index !== -1) {
          todos.value[index] = response.data
        }
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      error.value = err.message
      console.error('更新待办事项失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 删除待办事项
  const deleteTodo = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.deleteTodo(id)
      if (response.success) {
        todos.value = todos.value.filter(todo => todo._id !== id)
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      error.value = err.message
      console.error('删除待办事项失败:', err)
    } finally {
      loading.value = false
    }
  }

  const setFilter = (newFilter) => {
    filter.value = newFilter
  }

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(todo => !todo.isCompleted)
      case 'completed':
        return todos.value.filter(todo => todo.isCompleted)
      default:
        return todos.value
    }
  })

  const stats = computed(() => {
    const total = todos.value.length
    const completed = todos.value.filter(todo => todo.isCompleted).length
    const active = total - completed
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
    
    return { total, completed, active, percentage }
  })

  // 初始加载待办事项
  fetchTodos()

  return {
    todos,
    filter,
    loading,
    error,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
  }
}) 