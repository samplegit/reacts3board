import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://3.39.160.204:8080/api',
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || '요청 처리 중 오류가 발생했습니다.'
    return Promise.reject(new Error(message))
  },
)

export default api
