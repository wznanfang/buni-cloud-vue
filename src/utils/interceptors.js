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

// axios 响应拦截器
service.interceptors.response.use(
    (response) => {
        const { data, config } = response;
        // 1. 业务逻辑失败（code !== 200）
        if (!data || data.code !== 200) {
            const errorMessage = formatErrorMessage(data);
            ElMessage.error(errorMessage); // 所有失败请求均提示
            return Promise.reject(data);
        }
        // 2. 成功请求：非 GET 方法时提示成功
        if (config.method?.toLowerCase() !== 'get') {
            const actionName = getActionName(config.method, config.url);
            ElMessage.success(`${actionName}成功`); // 示例："删除成功"
        }
        return data;
    }, (error) => {
        // 3. 网络或服务器错误（统一处理）
        ElMessage.error(formatErrorMessage(error.response?.data) || '请求失败');
        return Promise.reject(error);
    }
);

// 错误信息格式化（复用）
function formatErrorMessage(data) {
    if (!data) return '未知错误';
    let message = data.message || '操作失败';
    if (data.errors?.length) {
        message += '：' + data.errors.map(e => e.message || e).join('，');
    }
    return message;
}

// 根据请求方法生成操作名称（可选）
function getActionName(method, url) {
    const actionMap = {
        post: '新增',
        put: '编辑',
        patch: '更新',
        delete: '删除'
    };
    return actionMap[method.toLowerCase()] || '操作';
}


export default service
