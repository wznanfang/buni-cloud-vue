<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex gap-4 mb-4">
      <el-input v-model="queryParams.username" @input="pageList" placeholder="用户名" clearable class="searchInput"/>
      <el-input v-model="queryParams.name" @input="pageList" placeholder="姓名" clearable class="searchInput" />
    </div>
    <div class="flex justify-end mb-4">
      <el-button @click="addRow" type="primary" >新增</el-button>
      <el-button @click="batchEnable(true)" type="warning" :disabled="selectedRows.length===0">启用</el-button>
      <el-button @click="batchEnable(false)" type="warning" :disabled="selectedRows.length===0">禁用</el-button>
      <el-button @click="batchDelete" type="danger" :disabled="selectedRows.length===0">删除</el-button>
    </div>
    <el-table class="userTable" :data="records" ref="table" :cell-style="{ textAlign: 'center' }"
              :header-cell-style="{ 'text-align': 'center' }" @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" fixed width="45"/>
      <el-table-column prop="username" label="用户名" width="120" fixed/>
      <el-table-column prop="name" label="姓名" width="120"/>
      <el-table-column prop="age" label="年龄" width="90"/>
      <el-table-column prop="sex" label="性别" width="90"/>
      <el-table-column prop="tel" label="电话" width="120"/>
      <el-table-column prop="enable" label="状态" width="90"/>
      <el-table-column prop="admin" label="管理员" width="90"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column label="操作" fixed="right" width="340">
        <template v-slot="scope">
          <div class="button-container">
            <el-button @click="editRow(scope.row)" :icon="Edit" type="primary"></el-button>
            <el-button @click="deleted(scope.row)" :icon="Delete" type="danger"></el-button>
            <el-button v-if="scope.row.enable === '启用'" @click="enableStatus(scope.row, false)" type="warning">禁用</el-button>
            <el-button v-else @click="enableStatus(scope.row, true)" type="warning">启用</el-button>
            <el-button @click="resetPassword(scope.row)" type="danger">重置密码</el-button>
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
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" :disabled="!addMode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input v-model="userForm.password" type="password" :disabled="!addMode" show-password clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
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
        </el-row>
        <el-row :gutter="15">
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
        </el-row>
        <el-row :gutter="15">
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
<!--      <el-button type="primary" @click="addUser">保存</el-button>-->
      <el-button type="primary" @click="submitForm">{{ addMode ? '新增用户' : '保存修改' }}</el-button>
    </span>
      </template>
    </el-dialog>
  </CommonLayout>
</template>


<script setup>
//引入
import CommonLayout from "@/components/base/CommonLayout.vue";
import {onMounted, reactive, ref} from 'vue';
import {ElMessage} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue'
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

//默认请求
onMounted(() => {
  pageList();
});

const queryParams = reactive({
  current: 1,
  size: 10,
  name: undefined,
  username: undefined,
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
 * 重置表单
 */
function resetForm() {
  if (addFormRef.value) {
    addFormRef.value.resetFields(); // 清除表单验证
  }
  userForm.value = {
    username: "",
    password: "",
    name: "",
    age: "",
    sex: "1",
    tel: "",
    enable: "0",
  };
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
  try {
    // 校验表单数据
    await addFormRef.value.validate();
    const payload = {
      ...userForm.value,
      password: Encrypt(userForm.value.password),
    };
    // 发送请求
    const res = await UserApi.save(payload);
    if (res.code === 200) {
      ElMessage.success("添加成功");
      showAddDialog.value = false;
      resetForm();
      // 刷新用户列表
      await pageList();
    } else {
      ElMessage.error(res.message);
    }
  } catch (error) {
    console.error("表单提交错误:", error);
  }
}

// 显示编辑对话框
async function editRow(row) {
  try {
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
  } catch (error) {
    ElMessage.error('查询失败，请稍后再试');
  }
}

// 更改
async function saveChanges() {
  try {
    userForm.value.sex = userForm.value.sex === '男' || userForm.value.sex === '1' ? 1 : 0;
    userForm.value.enable = userForm.value.enable === '启用' || userForm.value.enable === '1' ? 1 : 0;
    userForm.value.admin = userForm.value.admin === '是' || userForm.value.admin === '1' ? 1 : 0;
    const res = await UserApi.update(userForm.value)
    if (res.code === 200) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.error(res.message);
    }
    showAddDialog.value = false;
    await pageList();
  } catch (error) {
    console.error(error);
  }
}

//删除
async function deleted(row) {
  const response = await UserApi.delete(row.id)
  if (response.code === 200) {
    ElMessage.success('删除成功');
    await pageList();
  } else {
    ElMessage.error(response.message);
  }
}

// 启用-禁用
async function enableStatus(row, enable) {
  const data = {
    id: row.id,
    enable: enable ? 1 : 0
  };
  console.log(data);
  const response = await UserApi.enableStatus(data)
  if (response.code === 200) {
    ElMessage.success('操作成功');
    await pageList();
  } else {
    ElMessage.error(response.message);
  }
}

//重置密码
async function resetPassword(row) {
  const response = await UserApi.resetPassword(row.id)
  if (response.code === 200) {
    ElMessage.success('重置成功');
  } else {
    ElMessage.error(response.message);
  }
}

//批量删除
async function batchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
  const response = await UserApi.batchDelete(ids)
  if (response.code === 200) {
    ElMessage.success('删除成功');
    records.value = records.value.filter(item => !ids.includes(item.id));
    selectedRows.value = [];
    await pageList();
  } else {
    ElMessage.error(response.message);
  }
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
  const response = await UserApi.batchEnable(data)
  if (response.code === 200) {
    ElMessage.success('操作成功');
    records.value = records.value.filter(item => !ids.includes(item.id));
    selectedRows.value = [];
    await pageList();
  } else {
    ElMessage.error(response.message);
  }
}

//根据id查询
async function findById(id) {
  const response = await UserApi.getUserInfo(id)
  if (response.code === 200) {
    return response;
  } else {
    ElMessage.error(response.message);
  }
}

//分页查询
async function pageList() {
  const response = await UserApi.getPage(queryParams)
  if (response.code === 200) {
    records.value = response.result.records;
    totalRecords.value = response.result.total;
    records.value.forEach(item => {
      item.sex = item.sex === 1 ? '男' : '女';
      item.enable = item.enable === 1 ? '启用' : '禁用';
      item.admin = item.admin === 1 ? '是' : '否';
    })
  } else {
    ElMessage.error(response.message);
  }
}

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
