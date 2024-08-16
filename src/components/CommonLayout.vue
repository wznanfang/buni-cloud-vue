<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="logo">不逆云系统</span>
        <el-dropdown><span class="el-dropdown-link">{{ userInfo.name }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="myself">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-container class="content-container">
        <el-aside class="aside sidebar-container">
          <el-row class="tac">
            <el-col>
              <el-menu
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
                  :default-active=route.path
                  :default-openeds="defaultOpeneds"
                  router
                  unique-opened
              >
                <el-menu-item index="/Home">首页</el-menu-item>
                <el-sub-menu index="system">
                  <template #title>
                    <span>系统设置</span>
                  </template>
                  <el-menu-item index="/User">用户管理</el-menu-item>
                  <el-menu-item index="/Role">角色管理</el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main class="el-main">
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {API_BASE_URL} from '../config.js';

const route = useRoute();
const router = useRouter();
const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
const tokenVO = JSON.parse(sessionStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

// 计算需要展开的菜单项
const defaultOpeneds = computed(() => {
  if (route.path.includes('/User') || route.path.includes('/Role')) {
    return ['system'];
  }
  return [];
});

const handleOpen = (key: string, keyPath: string[]) => {
  // 请求对应的数据
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};


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
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('authToken');
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
.common-layout {
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  background-color: rgba(245, 245, 245, 0.93);
}

.header {
  height: 60px;
  margin: 0 200px;
  border-radius: 5px;
  background-color: rgba(30, 39, 50);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 20px;
  border: none; /* 去除边框 */
  box-shadow: none; /* 去除阴影 */
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  color: white;
  margin-right: 20px;
}

.aside {
  margin: 0 0 0 200px;
  width: 200px;
  background-color: rgb(245, 245, 245);
  height: 100%;
  overflow: hidden;
}

.el-main {
  padding: 0;
  margin: 0 200px 0 0;
  height: 100%;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-container {
  flex-shrink: 0;
}
</style>