<template>
  <span class="logo">不逆云系统</span>
  <el-dropdown><span class="el-dropdown-link">{{ userInfo.name }}</span>
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

const router = useRouter();
const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

// 清理会话信息的函数
const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/v1/loginOut`, {
      method: 'POST',
      headers: {
        'Authorization': token
      }
    });
    const result = await response.json();
    if (result.code === 200) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authToken');
      ElMessage.success('退出登录');
      await router.push({name: 'Login'});
    } else {
      ElMessage.error('退出登录失败');
    }
  } catch (error) {
    console.error('退出登录失败:', error);
  }
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