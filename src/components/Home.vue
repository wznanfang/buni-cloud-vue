<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-content">
      <div style="height: 120px;">
        <el-row>
          <el-col :span="6">
            <el-statistic title="注册用户数" :value="totalData.allUserNum"/>
          </el-col>
          <el-col :span="6">
            <el-statistic title="活跃用户数" :value="totalData.userNum"/>
          </el-col>
          <el-col :span="6">
            <el-statistic :value="totalData.sexManNum">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  性别分布
                  <el-icon style="margin-left: 4px" :size="12">
                    <Male/>
                  </el-icon>
                </div>
              </template>
              <template #suffix>/{{totalData.sexMenNum}}</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="待处理任务数" :value="totalData.todoNum">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <ChatLineRound/>
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
      <div style="height: 300px;">
        <v-chart autoresize :option="lineChartOptions"></v-chart>
      </div>

    </div>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from '@/components/base/CommonLayout.vue';
import {onMounted, ref} from 'vue';
import {ChatLineRound, Male} from '@element-plus/icons-vue'
import {UserApi} from "@/baseConfig/system/user.js";

const totalData = ref({
  allUserNum: 999,
  userNum: 666,
  sexManNum: 555,
  sexMenNum: 444,
  todoNum: 1,
});

// 在组件挂载时请求数据
onMounted(() => {
  statisticsData();
});

// 异步获取数据并更新图表配置
const statisticsData = async () => {
  const params = {days: 7};
  let res = await UserApi.statistics(params);
  // 使用解构赋值提取需要的数据
  const chartData = res.result.reduce((acc, {createTime, newUserCount}) => {
    acc.dates.push(createTime);
    acc.values.push(newUserCount);
    return acc;
  }, {dates: [], values: []});
  lineChartOptions.value = {
    ...lineChartOptions.value,
    xAxis: {
      ...lineChartOptions.value.xAxis,
      data: chartData.dates
    },
    series: [{
      ...lineChartOptions.value.series[0],
      data: chartData.values
    }]
  };
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

.el-col {
  text-align: center;
}

.breadcrumb {
  margin: 30px 0 20px 20px;
  font-size: 16px;
}

.page-content {
  width: 98%;
  margin: 30px 0 20px 20px;
}


</style>
