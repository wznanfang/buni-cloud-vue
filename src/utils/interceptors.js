import axios from 'axios'
import {ElMessage} from 'element-plus'
import {API_BASE_URL, BEARER} from '@/config.js'

// 创建 Axios 实例
const service = axios.create({
    baseURL: API_BASE_URL, // 设置 API 基础地址
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器：自动携带 token
service.interceptors.request.use(
    config => {
        const tokenVO = localStorage.getItem('authToken')
        if (tokenVO) {
            const token = JSON.parse(tokenVO).token
            config.headers.Authorization = `${BEARER}${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器：统一处理错误信息
service.interceptors.response.use(
    response => {
        if (response.data.code !== 200) {
            ElMessage.error(response.data.message || '请求失败')
            return Promise.reject(response.data)
        }
        return response.data
    },
    error => {
        console.error('请求错误:', error)
        ElMessage.error('服务器错误，请稍后重试')
        return Promise.reject(error)
    }
)

export default service
