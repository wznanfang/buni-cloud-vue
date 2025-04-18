<template>
  <div class="logo">
    <span>不逆</span>
  </div>
  <div class="header-container">
    <el-dropdown>
      <div class="el-dropdown-link">{{ loginUser?.name }}</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-avatar class="avatar" :src="loginUser?.avatar"/>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {AuthApi} from '@/baseConfig/system/auth.js'
import {useUserStore} from '@/utils/userStore.js'
import {storeToRefs} from 'pinia'
import {ElMessage} from "element-plus";

const router = useRouter()
const userStore = useUserStore()
const {loginUser} = storeToRefs(userStore)

function myself() {
  router.push('/UserProfile')
}

async function loginOut() {
  const response = await AuthApi.logout(router)
  if (response.code === 200) {
    userStore.clearUser()
    ElMessage.success('退出成功');
    await router.push({name: 'Login'});
  } else {
    ElMessage.error(response.data.message || "未知错误");
  }

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
