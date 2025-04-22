<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex gap-4 mb-4">
      <el-input v-model="queryParams.name" @input="pageList" clearable class="searchInput" placeholder="名字"/>
    </div>
    <div class="flex justify-end mb-4">
      <el-button @click="addRow" type="primary" plain>新增</el-button>
      <el-button @click="batchDelete" type="danger" plain :disabled="selectedRows.length===0">删除</el-button>
    </div>
    <el-table class="userTable" :data="records" border stripe fit ref="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" fixed width="45"/>
      <el-table-column prop="name" label="名字" fixed show-overflow-tooltip/>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="code" label="标识码"/>
      <el-table-column prop="url" label="接口地址" show-overflow-tooltip/>
      <el-table-column prop="sort" label="序号"/>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
      <el-table-column label="操作" fixed="right" width="160px">
        <template v-slot="scope">
          <div class="button-container">
            <el-button @click="editRow(scope.row)" :icon="Edit" type="primary" plain size="small"></el-button>
            <el-dropdown>
              <el-button type="primary" plain size="small">更多
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="deleted(scope.row)" :icon="Delete">删除</el-dropdown-item>
                  <el-dropdown-item @click="findChildren(scope.row)" :icon="Memo">详情</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <PaginationComponent
        v-model:current-page="queryParams.current"
        v-model:page-size="queryParams.size"
        :total="totalRecords"
        @page-change="pageList"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="showDialog" :title="addMode ? '新增权限' : '编辑权限'" width="35%">
      <el-form ref="addFormRef" :model="authorityForm" :rules="formRules" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="名字" prop="name">
              <el-input v-model="authorityForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标识码" prop="code">
              <el-input v-model="authorityForm.code" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接口地址" prop="url">
              <el-input v-model="authorityForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="类型" prop="type">
              <el-select v-model="authorityForm.type" placeholder="请选择类型">
                <el-option label="模块" :value='0'></el-option>
                <el-option label="菜单" :value='1'></el-option>
                <el-option label="按钮" :value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级菜单" prop="parentId">
              <el-cascader
                  v-model="authorityForm.parentId"
                  :options="cascaderOptions"
                  :props="cascaderProps"
                  placeholder="请选择"
                  @change="parentChange"
                  :show-all-levels=false
                  clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="序号" prop="sort">
              <el-input v-model="authorityForm.sort" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
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
import {ArrowDown, Delete, Edit, Memo} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router';
import PaginationComponent from "@/components/util/PageComponent.vue";
import {AuthorityApi} from "@/baseConfig/system/authority.js";

const router = useRouter();
const records = ref([]);
const totalRecords = ref(0); // 总记录数
const selectedRows = ref([]);
const showDialog = ref(false);
const addFormRef = ref(null);
const addMode = ref(true); // true: 新增模式，false: 编辑模式

const authorityForm = ref({
  name: '',
  code: '',
  parentId: 0,
  type: 0,
  sort: '',
  url: '',
});

const queryParams = reactive({
  current: 1,
  size: 10,
  name: '',
});

const cascaderOptions = ref([]);
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
  emitPath: false,
};

const formRules = reactive({
  name: [{required: true, message: '名字不能为空', trigger: 'blur'}],
  code: [{required: true, message: '编码不能为空', trigger: 'blur'}],
  type: [{required: true, message: '类型不能为空', trigger: 'blur'}],
  url: [{required: true, message: '接口地址不能为空', trigger: 'blur'}],
})

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

function parentChange(selectedValues) {
  authorityForm.parentId = selectedValues[selectedValues.length - 1];
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
      await addAuthority();
    } else {
      await saveChanges();
    }
  } catch (error) {
    console.error("表单提交错误:", error);
  }
}

//新增
const addRow = async () => {
  showDialog.value = true;
  addMode.value = true;
  resetForm();
  await fetchParentMenus();
};

async function addAuthority() {
  if (!addFormRef.value) {
    return;
  }
  await AuthorityApi.save(authorityForm.value)
  showDialog.value = false;
  await pageList();
}

// 显示编辑对话框
async function editRow(row) {
  await fetchParentMenus()
  let res = await findById(row.id);
  authorityForm.value = res.result;
  showDialog.value = true;
  addMode.value = false;
}

// 修改
async function saveChanges() {
  await AuthorityApi.update(authorityForm.value);
  showDialog.value = false;
  await pageList();
}

//删除
async function deleted(row) {
  await AuthorityApi.delete(row.id);
  await pageList();
}

//批量删除
async function batchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择数据');
    return;
  }
  const ids = selectedRows.value.map(row => row.id);
  await AuthorityApi.batchDelete(ids)
  records.value = records.value.filter(item => !ids.includes(item.id));
  selectedRows.value = [];
  await pageList();
}

//todo 查询子集权限
function findChildren(row) {
  router.push('/AuthorityInfo')
}

//根据id查询
async function findById(id) {
  return await AuthorityApi.findById(id);
}

//分页查询
async function pageList() {
  const res = await AuthorityApi.getPage(queryParams);
  records.value = res.result.records;
  totalRecords.value = res.result.total;
  records.value.forEach(item => {
    item.type = item.type === 0 ? "模块" : item.type === 1 ? "菜单" : "按钮";
  })
}


//请求父级菜单
async function fetchParentMenus() {
  const response = await AuthorityApi.findParent();
  cascaderOptions.value = response.result;
  return cascaderOptions.value;
}

/**
 * 重置表单
 */
const resetForm = () => {
  authorityForm.value = {
    name: '',
    code: '',
    parentId: 0,
    type: 0,
    sort: '',
    url: '',
  };
  nextTick(() => {
    addFormRef.value?.resetFields();
  });
};

//默认请求
onMounted(() => {
  pageList();
});

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
