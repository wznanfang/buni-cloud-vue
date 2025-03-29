<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span class="title">不逆云系统</span>
        </div>
      </template>
      <el-form :model="formData" ref="loginForm" label-width="auto" @submit.prevent="handleLogin" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" clearable placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="formData.password" clearable placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {AuthApi} from "@/baseConfig/system/auth.js";
import {UserApi} from "@/baseConfig/system/user.js";
import {Encrypt} from "@/utils/secret.js";
import {useUserStore} from "@/utils/userStore.js";

const router = useRouter();

const formData = ref({
  username: '',
  password: ''
});

async function handleLogin() {
  const loginVo = JSON.parse(JSON.stringify(formData.value));
  loginVo.password = Encrypt(loginVo.password);
  const res = await AuthApi.login(loginVo);
  if (res.code === 200) {
    const userStore = useUserStore()
    userStore.setToken(res.result.tokenVO)
    // 获取用户信息
    const userInfoRes = await UserApi.getUserInfo(res.result.id);
    userStore.setUser(userInfoRes)
    ElMessage.success('登录成功');
    await router.push({name: 'Home'});
  } else {
    ElMessage.error(res.data.message || "未知错误");
  }
}
</script>

<style scoped>
/* 确保整个容器占据全屏，并使用flexbox进行内容对齐 */
.login-container {
  display: flex;
  justify-content: flex-end; /* 将内容对齐到右侧 */
  align-items: center; /* 垂直居中 */
  height: 100%;
  background-image: url('/login/login_bg_2.webp');
  background-size: cover;
  background-position: center;
}

/* 调整登录卡片的样式，使其在右侧适当位置显示 */
.login-card {
  width: 350px; /* 设置一个固定的宽度 */
  margin-right: 10%; /* 给右边留出一定的空间 */
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all .3s ease-in-out;
}

.login-card:hover {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
}

.card-header {
  text-align: center;
}

.title {
  font-size: 20px;
  color: #333;
}

.login-form {
  padding: 0 20px;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #409EFF;
  border: none;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #3a8ee6;
}
</style>
