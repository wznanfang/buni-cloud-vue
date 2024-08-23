<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-content">
      <v-chart autoresize :option="lineChartOptions" style="height: 350px;"></v-chart>
    </div>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from '@/components/base/CommonLayout.vue';
import {onMounted, ref} from 'vue';
import {ElMessage} from "element-plus";
import axios from 'axios';
import {API_BASE_URL} from "@/config.js";

const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

// 在组件挂载时请求数据
onMounted(() => {
  fetchData();
});


// 异步获取数据并更新图表配置
const fetchData = async () => {
  axios.get(`${API_BASE_URL}/user/v1/user/statistics`, {
    headers: {
      Authorization: token
    },
    params: {days: 7}
  }).then(response => {
    const result = response.data.result;
    const dates = result.map(item => item.createTime);
    const values = result.map(item => item.newUserCount);
    //填充数据
    lineChartOptions.value = {
      ...lineChartOptions.value,
      xAxis: {
        ...lineChartOptions.value.xAxis,
        data: dates
      },
      series: [
        {
          ...lineChartOptions.value.series[0],
          data: values
        }
      ]
    };
  })
};

// 折线图配置
const lineChartOptions = ref({
  title: {
    text: '用户注册数'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '注册数',
      type: 'line',
      data: []
    }
  ]
});


</script>


<style scoped>

.breadcrumb {
  margin: 30px 0 20px 20px;
  font-size: 16px;
}

.page-content {
  width: 98%;
  margin: 30px 0 20px 20px;
}


</style>