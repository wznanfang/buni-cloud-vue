<template>
  <CommonLayout>
    <div class="flex gap-4 mb-4">
      <el-input
          v-model="usernameInput"
          clearable
          class="usernameInput"
          placeholder="用户名"
      />
      <el-input
          v-model="nameInput"
          clearable
          class="usernameInput"
          placeholder="姓名"
      />
      <el-button @click="search" class="searchButton" type="primary">查询</el-button>
    </div>
    <el-table
        :data="records"
        border
        style="width: 100%"
        ref="table"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="username" label="用户名" width="120"/>
      <el-table-column prop="name" label="姓名" width="150"/>
      <el-table-column prop="age" label="年龄" width="150"/>
      <el-table-column prop="sex" label="性别" width="150"/>
      <el-table-column prop="tel" label="电话" width="150"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column prop="createTime" label="操作">
        <template v-slot="scope">
          <el-button @click="findById(scope.row)" type="primary">编辑</el-button>
          <el-button @click="deleted(scope.row)" type="danger">删除</el-button>
          <el-button v-if="scope.row.enable" @click="toggleStatus(scope.row, false);" type="warning">禁用</el-button>
          <el-button v-else @click="toggleStatus(scope.row, true);" type="warning">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="batchDelete" class="deleteButton" type="danger">批量删除</el-button>
  </CommonLayout>
</template>


<script setup>
//引入
import CommonLayout from "@/components/CommonLayout.vue";
import {API_BASE_URL} from '../config.js';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {ElMessage} from "element-plus";

//变量
const records = ref([]);
const selectedRows = ref([]);
const usernameInput = ref('')
const nameInput = ref('')
const tokenVO = JSON.parse(sessionStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

//默认请求
onMounted(() => {
  search();
});

//新增

//编辑
function update(row) {
  console.log('操作行:', row);

}

//删除
function deleted(row) {
  axios.delete(`${API_BASE_URL}/user/v1/user/${row.id}`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    const result = response.data;
    if (result.code === 200) {
      ElMessage.success('删除成功');
      search();
    } else {
      ElMessage.error(result.message);
    }
  })
}

//批量删除
function batchDelete() {
  console.log('token:', token);
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
  console.log('批量删除的ID:', ids);
  axios.delete(`${API_BASE_URL}/user/v1/user/batchDelete`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    data: {ids}
  }).then(response => {
    const result = response.data;
    if (result.code === 200) {
      ElMessage.success('删除成功');
      records.value = records.value.filter(item => !ids.includes(item.id));
      selectedRows.value = [];
      search();
    } else {
      ElMessage.error(result.message);
    }
  })
}

//根据id查询
function findById(row) {
  axios.get(`${API_BASE_URL}/user/v1/user/${row.id}`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('查询成功');
      const info = response.data.result;
      console.log('查询结果:', info);
    } else {
      ElMessage.error(response.data.message);
    }
  })
}

//分页查询
function search() {
  axios.get(`${API_BASE_URL}/user/v1/user`, {
    headers: {
      'Authorization': token
    },
    params: {
      username: usernameInput.value,
      name: nameInput.value
    }
  }).then(response => {
    const result = response.data;
    console.log('请求成功:', result);
    if (result.code === 200) {
      records.value = result.result.records;
      records.value.forEach(item => {
        item.sex = item.sex === 1 ? '男' : '女';
      });
    } else {
      ElMessage.error(result.message);
    }
  })
}

function toggleStatus(row, enable) {
  const data = {
    id: row.id,
    enable: enable ? 1 : 0
  };

  axios.put(`${API_BASE_URL}/user/v1/user/forbidden`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  }).then(response => {
    const result = response.data;
    console.log('请求成功:', result);
    if (result.code === 200) {
      ElMessage.success('操作成功');
      search();
    } else {
      ElMessage.error(result.message);
    }
  })
}


</script>

<!--样式-->
<style scoped>
.flex {
  display: flex;
  margin: 20px 20px 20px 20px;
}

.usernameInput {
  width: 200px;
  margin: 0 20px;
}

.searchButton {
  margin-left: auto;
}

.deleteButton {
  margin: 20px 20px;
}

</style>