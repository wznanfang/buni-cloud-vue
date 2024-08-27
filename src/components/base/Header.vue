<template>
  <div class="logo">
    <span>不逆云系统</span>
  </div>
  <div class="header-container">
    <el-dropdown>
      <span class="el-dropdown-link">{{loginUser.name}}</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-avatar class="avatar" :src="loginUser.avatar"/>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {logout} from "@/baseConfig/auth.js";
import {ref} from "vue";

const router = useRouter();
const loginUser = ref(JSON.parse(localStorage.getItem('loginUser')));

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
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  color: rgb(245, 245, 245);
}


.avatar {
  margin-left: 20px;
}

</style>