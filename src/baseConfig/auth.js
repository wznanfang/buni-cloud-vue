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

//获取用户信息
export function getUserInfo(id, token) {
    return axios.get(`${API_BASE_URL}/user/v1/user/${id}`, {
        headers: {
            'Authorization': token
        }
    }).then(response => {
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error('获取个人信息失败');
        }
    });
}