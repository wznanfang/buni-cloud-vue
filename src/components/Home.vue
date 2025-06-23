<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-content">
      <div class="statistic-cards">
        <el-row gutter="20">
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic title="注册用户数" :value="totalData.allUserNum"/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic title="活跃用户数" :value="totalData.userNum"/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic :value="totalData.sexManNum">
                <template #title>
                  <div style="display: inline-flex; align-items: center; font-weight: bold;">
                    性别分布
                    <el-icon style="margin-left: 4px" :size="14">
                      <Male/>
                    </el-icon>
                  </div>
                </template>
                <template #suffix>/{{totalData.sexMenNum}}</template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistic-card">
              <el-statistic title="待处理任务数" :value="totalData.todoNum">
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em">
                    <ChatLineRound/>
                  </el-icon>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="chart-card">
        <v-chart autoresize :option="lineChartOptions" style="height: 300px;"></v-chart>
      </div>
    </div>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from '@/components/base/CommonLayout.vue';
import {onMounted, ref} from 'vue';
import {ChatLineRound, Male} from '@element-plus/icons-vue'
import {UserApi} from "@/baseConfig/system/user.js";
import * as echarts from 'echarts'

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
    text: '用户注册数',
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#d0d1d2',
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#d0d1d2',
    borderWidth: 1,
    textStyle: {
      color: '#333',
      fontSize: 14,
    },
    extraCssText: 'box-shadow: 0 2px 8px rgba(64,158,255,0.15); border-radius: 8px;'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '6%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: '#d0d1d2',
        width: 2
      }
    },
    axisLabel: {
      color: '#666',
      fontSize: 13
    },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f0f0f0',
        type: 'dashed'
      }
    },
    axisLine: { show: false },
    axisLabel: {
      color: '#666',
      fontSize: 13
    },
    axisTick: { show: false },
    minInterval: 1,
    splitNumber: 5,
    min: 0
  },
  series: [
    {
      name: '注册数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: '#d0d1d2',
        borderColor: '#fff',
        borderWidth: 3,
        shadowColor: 'rgba(64,158,255,0.3)',
        shadowBlur: 8
      },
      lineStyle: {
        color: '#d0d1d2',
        width: 4
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.25)' },
          { offset: 1, color: 'rgba(64,158,255,0.03)' }
        ])
      },
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

.statistic-cards {
  height: 120px;
  margin-bottom: 24px;
}

.statistic-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  padding: 24px 0 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
}
.statistic-card:hover {
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
  transform: translateY(-2px) scale(1.03);
}
.el-statistic__content {
  font-size: 2.2rem;
  font-weight: bold;
  color: #409EFF;
}
.el-statistic__title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.chart-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  padding: 24px 16px 12px 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
}
.chart-card:hover {
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
  transform: translateY(-2px) scale(1.01);
}

</style>
