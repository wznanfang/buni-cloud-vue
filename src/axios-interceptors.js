import axios from 'axios';
import { ElMessage } from 'element-plus';

const setupInterceptors = () => {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                ElMessage.error('登录过期，请重新登录');
                sessionStorage.removeItem('authToken');
                window.location.href = '/Login';
            }
            return Promise.reject(error);
        }
    );
};

export default setupInterceptors;