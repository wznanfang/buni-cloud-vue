<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <Header />
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
                  <el-menu-item index="/Authority">权限管理</el-menu-item>
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
import {useRoute} from 'vue-router';
import Header from '@/components/base/Header.vue';

const route = useRoute();

// 计算需要展开的菜单项
const defaultOpeneds = computed(() => {
  if (route.path.includes('/User') || route.path.includes('/Authority')) {
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
  border: none;
  box-shadow: none;
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