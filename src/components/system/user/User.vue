<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex gap-4 mb-4">
      <el-input v-model="queryParams.inputSearch" @input="pageList" placeholder="用户名/姓名" clearable class="searchInput"/>
    </div>
    <div class="flex justify-end mb-4">
      <el-button @click="addRow" type="primary">新增</el-button>
      <el-button @click="batchEnable(true)" type="warning" :disabled="selectedRows.length===0">启用</el-button>
      <el-button @click="batchEnable(false)" type="warning" :disabled="selectedRows.length===0">禁用</el-button>
      <el-button @click="batchDelete" type="danger" :disabled="selectedRows.length===0">删除</el-button>
    </div>

    <!--  内容展示区域  -->
    <el-table class="userTable" :data="records" border fit stripe ref="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" fixed width="45"/>
      <el-table-column prop="username" label="用户名" fixed/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="age" label="年龄"/>
      <el-table-column prop="sex" label="性别"/>
      <el-table-column prop="tel" label="电话"/>
      <el-table-column prop="enable" label="状态"/>
      <el-table-column prop="admin" label="管理员"/>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
      <el-table-column label="操作" fixed="right" width="160px">
        <template v-slot="scope">
          <div class="button-container">
            <el-button @click="editRow(scope.row)" :icon="Edit" type="primary" plain size="small"></el-button>
            <el-dropdown>
              <el-button type="primary" plain size="small">更多
                <el-icon class="el-icon--right"><arrow-down/></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="deleted(scope.row)" :icon="Delete">删除</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.enable === '启用'" @click="enableStatus(scope.row, false)" :icon="Open">禁用</el-dropdown-item>
                  <el-dropdown-item v-else @click="enableStatus(scope.row, true)" :icon="Open">启用</el-dropdown-item>
                  <el-dropdown-item @click="resetPassword(scope.row)" :icon="Lock">重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <PaginationComponent
        :currentPage.sync="queryParams.current"
        :pageSize.sync="queryParams.size"
        :totalRecords="totalRecords"
        @change="pageList"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="showAddDialog" :title="addMode ? '新增用户' : '编辑用户'" width="35%" @closed="resetForm">
      <el-form ref="addFormRef" :model="userForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" :disabled="!addMode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="addMode">
            <el-form-item label="密码" prop="password">
              <el-input v-model="userForm.password" type="password" show-password clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="userForm.age" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="userForm.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="userForm.tel" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="enable">
              <el-select v-model="userForm.enable" placeholder="是否启用">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </span>
      </template>
    </el-dialog>
  </CommonLayout>
</template>


<script setup>
//引入
import CommonLayout from "@/components/base/CommonLayout.vue";
import {nextTick, onMounted, reactive, ref} from 'vue';
import {ElMessage} from "element-plus";
import {ArrowDown, Delete, Edit, Lock, Open} from '@element-plus/icons-vue'
import {Encrypt} from '@/utils/secret.js';
import {UserApi} from "@/baseConfig/system/user.js"
import PaginationComponent from '@/components/util/PageComponent.vue';

//变量
const records = ref([]);
const selectedRows = ref([]);
const totalRecords = ref(0); // 总记录数
const showAddDialog = ref(false);
const addFormRef = ref(null);
const addMode = ref(true); // true: 新增模式，false: 编辑模式

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

const queryParams = reactive({
  current: 1,
  size: 10,
  inputSearch: '',
})

const userForm = ref({
  username: "",
  password: "",
  name: "",
  age: "",
  sex: "1",
  tel: "",
  enable: "0",
});

/**
 * 显示新增对话框
 */
function addRow() {
  showAddDialog.value = true;
  addMode.value = true;
  resetForm();
}

/**
 * 提交表单
 */
async function submitForm() {
  if (!addFormRef.value) {
    return;
  }
  try {
    await addFormRef.value.validate(); // 校验表单数据
    if (addMode.value) {
      await addUser();
    } else {
      await saveChanges();
    }
  } catch (error) {
    console.error("表单提交错误:", error);
  }
}

/**
 * 新增用户
 */
async function addUser() {
  if (!addFormRef.value) {
    return;
  }
  // 校验表单数据
  await addFormRef.value.validate();
  const payload = {
    ...userForm.value,
    password: Encrypt(userForm.value.password),
  };
  await UserApi.save(payload);
  showAddDialog.value = false;
  resetForm();
  await pageList();
}

// 显示编辑对话框
async function editRow(row) {
  const res = await findById(String(row.id));
  userForm.value.id = res.result.id;
  userForm.value.username = res.result.username;
  userForm.value.name = res.result.name;
  userForm.value.age = res.result.age;
  userForm.value.sex = res.result.sex === 1 ? '男' : '女';
  userForm.value.tel = res.result.tel;
  userForm.value.enable = res.result.enable === 1 ? '启用' : '禁用';
  userForm.value.admin = res.result.admin === 1 ? '是' : '否';
  showAddDialog.value = true;
  addMode.value = false;
}

// 更改
async function saveChanges() {
  try {
    userForm.value.sex = userForm.value.sex === '男' || userForm.value.sex === '1' ? 1 : 0;
    userForm.value.enable = userForm.value.enable === '启用' || userForm.value.enable === '1' ? 1 : 0;
    userForm.value.admin = userForm.value.admin === '是' || userForm.value.admin === '1' ? 1 : 0;
    await UserApi.update(userForm.value)
    showAddDialog.value = false;
    await pageList();
  } catch (error) {
    console.error(error);
  }
}

//删除
async function deleted(row) {
  await UserApi.delete(row.id)
  await pageList();
}

// 启用-禁用
async function enableStatus(row, enable) {
  const data = {
    id: row.id,
    enable: enable ? 1 : 0
  };
  console.log(data);
  await UserApi.enableStatus(data)
  await pageList();
}

//重置密码
async function resetPassword(row) {
  await UserApi.resetPassword(row.id)
}

//批量删除
async function batchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
  await UserApi.batchDelete(ids)
  records.value = records.value.filter(item => !ids.includes(item.id));
  selectedRows.value = [];
  await pageList();
}

//批量启用-禁用
async function batchEnable(enable) {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
  const data = {
    idVOs: {ids},
    enable: enable ? 1 : 0
  };
  await UserApi.batchEnable(data)
  records.value = records.value.filter(item => !ids.includes(item.id));
  selectedRows.value = [];
  await pageList();
}

//根据id查询
async function findById(id) {
  return await UserApi.getUserInfo(id);
}

//分页查询
async function pageList() {
  const response = await UserApi.getPage(queryParams)
  records.value = response.result.records;
  totalRecords.value = response.result.total;
  records.value.forEach(item => {
    item.sex = item.sex === 1 ? '男' : '女';
    item.enable = item.enable === 1 ? '启用' : '禁用';
    item.admin = item.admin === 1 ? '是' : '否';
  })
}

/**
 * 重置表单
 */
function resetForm() {
  userForm.value = {
    username: "",
    password: "",
    name: "",
    age: "",
    sex: "1",
    tel: "",
    enable: "0",
  };
  nextTick(() => {
    addFormRef.value?.resetFields();
  });
}

//默认请求
onMounted(() => {
  pageList();
});

</script>

<!--样式-->
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

.searchInput {
  width: 200px;
  margin-right: 20px;
}

.userTable {
  width: 98%;
  margin-left: 20px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
