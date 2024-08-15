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
          class="nameInput"
          placeholder="姓名"
      />
      <el-button @click="search" class="searchButton" type="primary">查询</el-button>
    </div>
    <el-table
        class="userTable"
        :data="records"
        border
        stripe
        fit
        ref="table"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="username" label="用户名" width="120"/>
      <el-table-column prop="name" label="姓名" width="150"/>
      <el-table-column prop="age" label="年龄" width="100"/>
      <el-table-column prop="sex" label="性别" width="100"/>
      <el-table-column prop="tel" label="电话" width="150"/>
      <el-table-column prop="enable" label="状态" width="100"/>
      <el-table-column prop="admin" label="管理员" width="100"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column prop="createTime" label="操作" fixed="right">
        <template v-slot="scope">
          <div class="button-container">
            <el-button @click="findById(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleted(scope.row)" type="danger">删除</el-button>
            <el-button v-if="scope.row.enable" @click="toggleStatus(scope.row, false);" type="warning">禁用</el-button>
            <el-button v-else @click="toggleStatus(scope.row, true);" type="warning">启用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-button @click="batchDelete" class="batchDeleteButton" type="danger">批量删除</el-button>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
      >
      </el-pagination>
    </div>
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
const currentPage = ref(1); // 当前页
const pageSize = ref(10); // 每页显示记录数
const totalRecords = ref(0); // 总记录数
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
      name: nameInput.value,
      page: currentPage.value,
      size: pageSize.value
    }
  }).then(response => {
    const result = response.data;
    console.log('请求成功:', result);
    if (result.code === 200) {
      records.value = result.result.records;
      totalRecords.value = result.result.total;
      records.value.forEach(item => {
        item.sex = item.sex === 1 ? '男' : '女';
        item.enable = item.enable === 1 ? '启用' : '禁用';
        item.admin = item.admin === 1 ? '是' : '否';
      })
    } else {
      ElMessage.error(result.message);
    }
  })
}

// 分页大小改变时
function handleSizeChange(val) {
  pageSize.value = val;
  search();
}

// 当前页改变时
function handleCurrentChange(val) {
  currentPage.value = val;
  search();
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
  height: 35px;
  width: 200px;
}

.nameInput {
  height: 35px;
  width: 200px;
  margin-left: 30px;
}

.searchButton {
  height:35px;
  margin-left: auto;
}

.userTable{
  margin: 20px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 92%;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 20px;
}

</style>