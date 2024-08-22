<template>
  <span class="logo">不逆云系统</span>
  <el-dropdown><span class="el-dropdown-link">{{ loginUser.name }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
        <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {logout} from "@/baseConfig/auth.js";

const router = useRouter();
const loginUser = JSON.parse(localStorage.getItem('loginUser'));

function myself() {
  router.push('/UserProfile')
}

function loginOut() {
  logout();
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