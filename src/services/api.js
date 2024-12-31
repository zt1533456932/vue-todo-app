import axios from 'axios'

const BASE_URL = 'https://ytqyivcwqilq.sealoshzh.site'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 移除 withCredentials 设置
  withCredentials: false
})

// 添加响应拦截器以更好地处理错误
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error)
    if (error.response) {
      // 服务器返回了错误响应
      throw new Error(error.response.data?.message || `请求失败: ${error.response.status}`)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      throw new Error('服务器无响应，请检查网络连接')
    } else {
      // 请求配置出错
      throw new Error('请求配置错误')
    }
  }
)

export const todoApi = {
  // 获取所有待办事项
  getTodos: async () => {
    try {
      const response = await api.get('/api/get-todo')
      return response.data
    } catch (error) {
      console.error('getTodos error:', error)
      throw new Error(error.message || '获取待办事项失败')
    }
  },

  // 添加新的待办事项
  addTodo: async (value) => {
    try {
      const response = await api.post('/api/add-todo', {
        value,
        isCompleted: false
      })
      return response.data
    } catch (error) {
      throw new Error(error.message || '添加待办事项失败')
    }
  },

  // 更新待办事项状态
  updateTodo: async (id) => {
    try {
      const response = await api.post(`/api/update-todo/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || '更新待办事项失败')
    }
  },

  // 删除待办事项
  deleteTodo: async (id) => {
    try {
      const response = await api.post(`/api/del-todo/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || '删除待办事项失败')
    }
  }
}