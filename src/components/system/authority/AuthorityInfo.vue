<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Authority' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
  </CommonLayout>
</template>

<script setup>

import CommonLayout from "@/components/base/CommonLayout.vue";
</script>

<style scoped>


.breadcrumb {
  margin: 30px 0 20px 20px;
  font-size: 16px;
}

.flex {
  display: flex;
  margin: 30px 0 20px 20px;
  align-items: center;
}

.flex-grow {
  flex-grow: 1;
}

</style>