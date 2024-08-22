<template>
  <span class="logo">不逆云系统</span>
  <el-dropdown><span class="el-dropdown-link">{{ loginUser.name }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {API_BASE_URL} from '../config.js';
import axios from 'axios';

const router = useRouter();
const loginUser = JSON.parse(localStorage.getItem('loginUser'));
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

function myself() {
  router.push('/UserProfile')
}


// 清理会话信息的函数
function logout() {
  axios.post(`${API_BASE_URL}/user/v1/loginOut`, {
    headers: {
      'Authorization': token
    }
  }).then(async response => {
    if (response.data.code === 200) {
      localStorage.removeItem('loginUser');
      localStorage.removeItem('authToken');
      ElMessage.success('退出登录');
      await router.push({name: 'Login'});
    } else {
      ElMessage.error('退出登录失败');
    }
  }).catch(() => {
    ElMessage.error('退出登录失败');
  })

}
</script>


<style scoped>


.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  color: white;
  margin-right: 20px;
}

</style>