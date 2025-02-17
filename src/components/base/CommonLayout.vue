<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部导航 -->
      <el-header class="header">
        <Header />
      </el-header>

      <el-container class="content-container">
        <!-- 侧边栏 -->
        <el-aside class="aside sidebar-container">
          <el-row class="tac">
            <el-col>
              <el-menu
                  class="el-menu-vertical-demo"
                  :default-active="activeMenu"
                  :default-openeds="defaultOpeneds"
                  router
                  unique-opened
              >
                <template v-for="menu in menuList" :key="menu.index">
                  <el-menu-item v-if="!menu.children" :index="menu.index">
                    {{ menu.title }}
                  </el-menu-item>
                  <el-sub-menu v-else :index="menu.index">
                    <template #title>
                      <span>{{ menu.title }}</span>
                    </template>
                    <el-menu-item
                        v-for="sub in menu.children"
                        :key="sub.index"
                        :index="sub.index"
                    >
                      {{ sub.title }}
                    </el-menu-item>
                  </el-sub-menu>
                </template>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="el-main">
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/base/Header.vue';

const route = useRoute();

/** 菜单配置 */
const menuList = [
  { index: '/Home', title: '首页' },
  {
    index: 'system',
    title: '系统设置',
    children: [
      { index: '/User', title: '用户管理' },
      { index: '/Authority', title: '权限管理' }
    ]
  }
];

/** 当前激活的菜单 */
const activeMenu = computed(() => route.path);

/** 计算需要展开的菜单 */
const defaultOpeneds = computed(() => {
  return menuList
      .filter(menu => menu.children && menu.children.some(sub => sub.index === route.path))
      .map(menu => menu.index);
});
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
