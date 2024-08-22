<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-content">
      <span>欢迎来到不逆云首页</span>
    </div>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from '@/components/CommonLayout.vue';

</script>



<style scoped>

.breadcrumb {
  margin: 30px 0 20px 20px;
  font-size: 16px;
}

.page-content {
  margin: 30px 0 20px 20px;
}


</style>