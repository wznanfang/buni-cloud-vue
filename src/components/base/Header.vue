<template>
  <div class="logo">
    <span>不逆云系统</span>
  </div>
  <div class="header-container">
    <el-avatar class="avatar" src="{{loginUser.avator}}"/>
    <el-dropdown>
      <span class="el-dropdown-link">{{ loginUser.name }}</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
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
  logout(router);
}

</script>


<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
}

.avatar {
  cursor: pointer;
  font-size: 16px;
  color: white;
  margin-right: 20px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  color: white;
}

</style>