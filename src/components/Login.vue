<template>
  <div class="login-container">
    <el-form :model="form" ref="loginForm" label-width="120px" class="login-form">
      <h2 class="login-title">不逆云系统</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" class="login-input"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" show-password v-model="form.password" placeholder="请输入密码" class="login-input"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {API_BASE_URL} from '../config.js';


const form = ref({
  username: '',
  password: ''
});

const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password
      })
    });

    const result = await response.json();

    if (response.ok) {
      if (result.code === 200) {
        sessionStorage.setItem('authToken', JSON.stringify(result.result.tokenVO));
        ElMessage.success('登录成功');
        await router.push({name: 'Home'});
      } else {
        ElMessage.error(result.message);
      }
    } else {
      console.error('登录失败:', result);
    }
  } catch (error) {
    console.error('请求错误:', error);
  }
};
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/login/login_bg.jpg');
  background-size: cover;
  background-position: center;
}

.login-form {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}


.login-input {
  width: 100%;
  height: 40px;
}

.login-button {
  width: 100%;
  height: 40px;
}

</style>