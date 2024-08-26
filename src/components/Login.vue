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
import axios from 'axios';
import {API_BASE_URL} from '../config.js';
import {Encrypt} from '../baseConfig/secret.js';

const router = useRouter();

const form = ref({
  username: '',
  password: ''
});

function handleLogin() {
  let password = Encrypt(form.value.password)
  const body = {
    username: form.value.username,
    password: password
  }
  axios.post(`${API_BASE_URL}/user/v1/login`, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.data.code === 200) {
      localStorage.setItem('loginUser', JSON.stringify(response.data.result));
      localStorage.setItem('authToken', JSON.stringify(response.data.result.tokenVO));
      ElMessage.success('登录成功');
      router.push({name: 'Home'});
    } else {
      ElMessage.error(response.data.message);
    }
  })
}
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
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 300px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}


.login-input {
  width: 100%;
  height: 40px;
  margin-right: 50px;
}

.login-button {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  margin-right: 50px;
}

</style>