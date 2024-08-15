<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="aside">
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
      <el-main class="main">
        <slot></slot>
      </el-main>
    </el-container>
  </div>

</template>

<script lang="ts" setup>

import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 计算需要展开的菜单项
const defaultOpeneds = computed(() => {
  if (route.path.includes('/User') || route.path.includes('/Role')) {
    return ['system'];
  }
  return [];
});

const handleOpen = (key: string, keyPath: string[]) => {
  // 请求对应的数据
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>


<style scoped>

.common-layout {
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  background-color: rgb(245, 245, 245);
}

.aside {
  margin: 0 0 0 200px;
  width: 200px;
  background-color: rgb(245, 245, 245);
}

.el-main {
  padding: 0;
  margin: 0;
}

.main {
  margin: 0 200px 0 0;
}

</style>