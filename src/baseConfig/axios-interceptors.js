import axios from 'axios';
import { ElMessage } from 'element-plus';

//拦截器，判断是否是401
const setupInterceptors = () => {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                ElMessage.error('登录过期，请重新登录');
                sessionStorage.removeItem('authToken');
                window.location.href = '/Login';
            }
            if (error.response && error.response.status === 403) {
                ElMessage.error('无权访问');
            }
            if (error.response && error.response.status === 500) {
                ElMessage.error('服务器错误，请稍后再试');
            }
            return Promise.reject(error);
        }
    );
};

export default setupInterceptors;