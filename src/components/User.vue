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
    <div class="flex justify-end mb-4">
      <el-button @click="addRow" class="addButton" type="primary">新增</el-button>
      <el-button @click="batchDelete" class="batchDeleteButton" type="danger">批量删除</el-button>
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
            <el-button @click="editRow(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleted(scope.row)" type="danger">删除</el-button>
            <el-button v-if="scope.row.enable === '启用'" @click="toggleStatus(scope.row, false)" type="warning">禁用</el-button>
            <el-button v-else @click="toggleStatus(scope.row, true)" type="warning">启用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
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

    <!-- 新增对话框 -->
    <el-dialog v-model="showAddDialog" title="新增用户" width="30%">
      <el-form :model="addForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="用户名">
              <el-input v-model="addForm.username" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="密码">
              <el-input v-model="addForm.password" type="password" show-password clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="姓名">
              <el-input v-model="addForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="年龄">
              <el-input v-model="addForm.age" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="性别">
              <el-select v-model="addForm.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="电话">
              <el-input v-model="addForm.tel" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select v-model="addForm.enable" placeholder="是否启用">
                <el-option label="启用" value='1'></el-option>
                <el-option label="禁用" value='0'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="addUser">保存</el-button>
    </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑信息" width="30%">
      <el-form :model="editForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名">
              <el-input v-model="editForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="年龄">
              <el-input v-model="editForm.age" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别">
              <el-select v-model="editForm.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="电话">
              <el-input v-model="editForm.tel" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-input v-model="editForm.enable" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="管理员">
              <el-input v-model="editForm.admin" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveChanges">保存</el-button>
    </span>
      </template>
    </el-dialog>
  </CommonLayout>
</template>


<script setup>
//引入
import CommonLayout from "@/components/CommonLayout.vue";
import {API_BASE_URL} from '../config.js';
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import {ElMessage} from "element-plus";

//变量
const tokenVO = JSON.parse(sessionStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;
const records = ref([]);
const selectedRows = ref([]);
const usernameInput = ref('')
const nameInput = ref('')
const currentPage = ref(1); // 当前页
const pageSize = ref(10); // 每页显示记录数
const totalRecords = ref(0); // 总记录数

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

//默认请求
onMounted(() => {
  search();
});

//新增
const showAddDialog = ref(false);
const addForm = reactive({
  username: '',
  password: '',
  name: '',
  age: '',
  sex: '男',
  tel: '',
  enable: '禁用',
});

// 显示新增对话框
function addRow() {
  addForm.username = '';
  addForm.password = '';
  addForm.name = '';
  addForm.age = '';
  addForm.sex = '男';
  addForm.tel = '';
  addForm.enable = '禁用';
  showAddDialog.value = true;
}

async function addUser() {
  try {
    addForm.sex = addForm.sex === '男' ? 1 : 0;
    addForm.enable = addForm.enable === '启用' ? 1 : 0;
    await save(addForm);
    showAddDialog.value = false;
    search();
  } catch (error) {
    console.error(error);
  }
}

function save() {
  return axios.post(`${API_BASE_URL}/user/v1/user`, addForm, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('添加成功');
    } else {
      ElMessage.error(response.data.message);
    }
  })
}

//编辑
const dialogVisible = ref(false);
const editForm = reactive({
  username: '',
  name: '',
  age: '',
  sex: '',
  tel: '',
  enable: '',
  admin: ''
});

// 显示编辑对话框
async function editRow(row) {
  try {
    const response = await findById(row.id);
    editForm.id = response.data.result.id;
    editForm.username = response.data.result.username;
    editForm.name = response.data.result.name;
    editForm.age = response.data.result.age;
    editForm.sex = response.data.result.sex === 1 ? '男' : '女';
    editForm.tel = response.data.result.tel;
    editForm.enable = response.data.result.enable === 1 ? '启用' : '禁用';
    editForm.admin = response.data.result.admin === 1 ? '是' : '否';
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('查询失败，请稍后再试');
  }
}

// 保存更改
async function saveChanges() {
  try {
    editForm.sex = editForm.sex === '男' ? 1 : 0;
    editForm.admin = editForm.admin === '是' ? 1 : 0;
    editForm.enable = editForm.enable === '启用' ? 1 : 0;
    await update(editForm);
    dialogVisible.value = false;
    search();
  } catch (error) {
    console.error(error);
  }
}

function update(user) {
  return axios.put(`${API_BASE_URL}/user/v1/user`, user, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.error(response.data.message);
    }
  });
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
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
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
function findById(id) {
  return axios.get(`${API_BASE_URL}/user/v1/user/${id}`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      return response;
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
  height: 35px;
  margin-left: 30px;
}

.addButton {
  height: 35px;
}

.batchDeleteButton {
  height: 35px;
}

.userTable {
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
  justify-content: flex-end;
  align-items: center;
  margin: 20px 20px;
}

</style>