<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex gap-4 mb-4">
      <el-input
          v-model="nameInput"
          clearable
          class="nameInput"
          placeholder="名字"
      />
      <div class="flex-grow"></div>
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
      <el-table-column type="selection" fixed width="45"/>
      <el-table-column prop="name" label="名字" width="150" show-overflow-tooltip/>
      <el-table-column prop="type" label="类型" width="120"/>
      <el-table-column prop="code" label="标识码" width="150"/>
      <el-table-column prop="sort" label="序号" width="120"/>
      <el-table-column prop="url" label="接口地址" width="270" show-overflow-tooltip/>
      <el-table-column prop="createTime" label="创建时间" width="200"/>
      <el-table-column label="操作" fixed="right" width="230">
        <template v-slot="scope">
          <div class="button-container">
            <el-button @click="editRow(scope.row)" :icon="Edit" type="primary"></el-button>
            <el-button @click="deleted(scope.row)" :icon="Delete" type="danger"></el-button>
            <el-button @click="findChildren(scope.row)" type="primary">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
      >
      </el-pagination>
    </div>

    <!-- 新增对话框 -->
    <el-dialog v-model="showAddDialog" title="新增权限" width="35%">
      <el-form :model="addForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="名字">
              <el-input v-model="addForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标识码">
              <el-input v-model="addForm.code" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="类型">
              <el-select v-model="addForm.type" placeholder="请选择类型">
                <el-option label="模块" value='0'></el-option>
                <el-option label="菜单" value='1'></el-option>
                <el-option label="按钮" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级菜单">
              <el-cascader
                  v-model="addForm.parentId"
                  :options="cascaderOptions"
                  :props="cascaderProps"
                  placeholder="请选择"
                  @change="addParentChange"
                  :show-all-levels=false
                  clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="序号">
              <el-input v-model="addForm.sort" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接口地址">
              <el-input v-model="addForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="addAuthority">保存</el-button>
    </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="showEditDialog" title="修改权限" width="35%">
      <el-form :model="editForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="名字">
              <el-input v-model="editForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标识码">
              <el-input v-model="editForm.code" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="类型">
              <el-select v-model="editForm.type" placeholder="请选择类型">
                <el-option label="模块" value='0'></el-option>
                <el-option label="菜单" value='1'></el-option>
                <el-option label="按钮" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级菜单">
              <el-cascader
                  v-model="editForm.parentId"
                  :options="cascaderOptions"
                  :props="cascaderProps"
                  placeholder="请选择"
                  @change="editParentChange"
                  :show-all-levels=false
                  clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="序号">
              <el-input v-model="editForm.sort" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接口地址">
              <el-input v-model="editForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showEditDialog = false">取消</el-button>
      <el-button type="primary" @click="saveChanges">保存</el-button>
    </span>
      </template>
    </el-dialog>

  </CommonLayout>
</template>

<script setup>
//引入
import CommonLayout from "@/components/base/CommonLayout.vue";
import {API_BASE_URL,BEARER} from '@/config.js';
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import {ElMessage} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router';

const router = useRouter();
//变量
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = BEARER + tokenVO.token;
const records = ref([]);
const selectedRows = ref([]);
const currentPage = ref(1); // 当前页
const pageSize = ref(10); // 每页显示记录数
const totalRecords = ref(0); // 总记录数
const nameInput = ref('');

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

//默认请求
onMounted(() => {
  search();
});

const cascaderOptions = ref([]);
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
};

//请求父级菜单
function fetchParentMenus() {
  return axios.get(`${API_BASE_URL}/user/v1/findMenuTree`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      cascaderOptions.value = response.data.result;
      return cascaderOptions.value;
    } else {
      ElMessage.error(response.data.message);
      return [];
    }
  })
}

function addParentChange(selectedValues) {
  addForm.parentId = selectedValues[selectedValues.length - 1];
}

function editParentChange(selectedValues) {
  editForm.parentId = selectedValues[selectedValues.length - 1];
}

//新增
const showAddDialog = ref(false);

function addRow() {
  addForm.name = '';
  addForm.code = '';
  addForm.parentId = '';
  addForm.type = '';
  addForm.sort = '';
  addForm.url = '';
  fetchParentMenus();
  showAddDialog.value = true;
}

const addForm = reactive({
  name: '',
  code: '',
  parentId: '',
  type: '',
  sort: '',
  url: '',
});

function addAuthority() {
  try {
    save(addForm);
    showAddDialog.value = false;
    search();
  } catch (error) {
    console.error(error);
  }
}

//新增权限
function save() {
  return axios.post(`${API_BASE_URL}/user/v1/authority`, addForm, {
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
const showEditDialog = ref(false);
const editForm = reactive({
  name: '',
  code: '',
  parentId: '',
  type: '',
  sort: '',
  url: '',
});

// 递归查找路径
function findPathById(options, id) {
  let path = [];

  function search(options) {
    for (const option of options) {
      if (option.id === id.toString()) {
        path = [option.id];
        return true;
      }
      if (option.children) {
        const found = search(option.children);
        if (found) {
          path = [option.id, ...path];
          return true;
        }
      }
    }
    return false;
  }

  search(options);
  return path;
}

// 显示编辑对话框
function editRow(row) {
  fetchParentMenus().then(() => {
    return findById(row.id);
  }).then(response => {
    let type = response.data.result.type;
    editForm.type = type === 0 ? "模块" : type === 1 ? "菜单" : "按钮";
    editForm.id = response.data.result.id;
    editForm.name = response.data.result.name;
    editForm.code = response.data.result.code;
    editForm.sort = response.data.result.sort;
    editForm.url = response.data.result.url;
    editForm.parentId = findPathById(cascaderOptions.value, response.data.result.parentId)[0];
    showEditDialog.value = true;
  })
  console.log(editForm)
}

// 保存更改
async function saveChanges() {
  try {
    editForm.type = editForm.type === '模块' ? 0 : editForm.type === '菜单' ? 1 : 2;
    console.log(editForm);
    await update(editForm);
    showEditDialog.value = false;
    search();
  } catch (error) {
    console.error(error);
  }
}

// 修改
function update(authority) {
  return axios.put(`${API_BASE_URL}/user/v1/authority`, authority, {
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
  axios.delete(`${API_BASE_URL}/user/v1/authority/${row.id}`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('删除成功');
      search();
    } else {
      ElMessage.error(response.data.message);
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
  axios.delete(`${API_BASE_URL}/user/v1/authority`, {
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

//todo 查询子集权限
function findChildren(row) {
  router.push('/AuthorityInfo')
}

//根据id查询
function findById(id) {
  return axios.get(`${API_BASE_URL}/user/v1/authority/${id}`, {
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
  axios.get(`${API_BASE_URL}/user/v1/authority`, {
    headers: {
      'Authorization': token
    },
    params: {
      name: nameInput.value,
      current: currentPage.value,
      size: pageSize.value
    }
  }).then(response => {
    const result = response.data;
    if (result.code === 200) {
      records.value = result.result.records;
      totalRecords.value = result.result.total;
      records.value.forEach(item => {
        item.type = item.type === 0 ? "模块" : item.type === 1 ? "菜单" : "按钮";
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

.nameInput, .searchButton {
  height: 35px;
}

.nameInput {
  width: 200px;
}

.addButton, .batchDeleteButton {
  height: 35px;
}

.userTable {
  width: 98%;
  margin-left: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
}


</style>