import axios from 'axios';
import {ElMessage} from 'element-plus';
import {API_BASE_URL} from "@/config.js";


//退出登录
export function logout(router) {
    const tokenVO = JSON.parse(localStorage.getItem('authToken'));
    const token = 'bearer ' + tokenVO.token;
    axios.post(`${API_BASE_URL}/user/v1/loginOut`, null, {
        headers: {
            'Authorization': token
        }
    }).then(response => {
        if (response.data.code === 200) {
            localStorage.removeItem('loginUser');
            localStorage.removeItem('authToken');
            ElMessage.success('退出登录');
            router.push({name: 'Login'});
        } else {
            ElMessage.error('退出登录失败');
        }
    })

}