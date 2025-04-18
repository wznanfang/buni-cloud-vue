import axios from 'axios'
import {ElMessage} from 'element-plus'
import {API_BASE_URL, BEARER,AUTH_TOKEN} from '@/config.js'

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
        const tokenVO = localStorage.getItem(AUTH_TOKEN)
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
        // 确保 response.data 存在，并且 code 不是 200
        if (!response.data || response.data.code !== 200) {
            let errorMessage = response.data?.message || '请求失败'
            // 如果有 errors 详情，拼接错误信息
            if (response.data?.errors && Array.isArray(response.data.errors)) {
                errorMessage += '：' + response.data.errors.map(err => err.message || err).join('，')
            }
            ElMessage.error(errorMessage) // 弹框提示
            return Promise.reject(response.data)
        }
        return response.data
    }, error => {
        console.error('请求错误:', error)
        let errorMessage = '服务器错误，请稍后重试'
        if (error.response && error.response.data) {
            const resData = error.response.data
            errorMessage = resData.message || errorMessage
            // 进一步解析 errors 详细信息
            if (resData.errors && Array.isArray(resData.errors)) {
                errorMessage += '：' + resData.errors.map(err => err.message || err).join('，')
            }
        }
        ElMessage.error(errorMessage) // 弹框提示错误
        return Promise.reject(error)
    }
)


export default service
