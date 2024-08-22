import axios from 'axios';
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {API_BASE_URL} from "@/config.js";


const router = useRouter();
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

export async function logout() {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/v1/loginOut`, {
            headers: {
                'Authorization': token
            }
        });
        if (response.data.code === 200) {
            localStorage.removeItem('loginUser');
            localStorage.removeItem('authToken');
            ElMessage.success('退出登录');
            await router.push({name: 'Login'});
        } else {
            ElMessage.error('退出登录失败');
        }
    } catch (error) {
        ElMessage.error('退出登录失败');
    }
}