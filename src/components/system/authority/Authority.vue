<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex gap-4 mb-4">
      <el-input v-model="nameInput" clearable class="searchInput" placeholder="名字"/>
      <el-button @click="pageList" class="searchButton" type="primary" plain>查询</el-button>
    </div>
    <div class="flex justify-end mb-4">
      <el-button @click="addRow" type="primary" plain>新增</el-button>
      <el-button @click="batchDelete" type="danger" plain :disabled="selectedRows.length===0">删除</el-button>
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
      <el-table-column prop="name" label="名字" width="150" fixed show-overflow-tooltip/>
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


    <PaginationComponent
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        :totalRecords="totalRecords"
        @change="pageList"
    />

    <!-- 新增对话框 -->
    <el-dialog v-model="showDialog" title="新增权限" width="35%">
      <el-form :model="authorityForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="名字">
              <el-input v-model="authorityForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标识码">
              <el-input v-model="authorityForm.code" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="类型">
              <el-select v-model="authorityForm.type" placeholder="请选择类型">
                <el-option label="模块" value='0'></el-option>
                <el-option label="菜单" value='1'></el-option>
                <el-option label="按钮" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级菜单">
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
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="序号">
              <el-input v-model="authorityForm.sort" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接口地址">
              <el-input v-model="authorityForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="addAuthority">保存</el-button>
    </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="showDialog" title="修改权限" width="35%">
      <el-form :model="authorityForm" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="名字">
              <el-input v-model="authorityForm.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标识码">
              <el-input v-model="authorityForm.code" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="类型">
              <el-select v-model="authorityForm.type" placeholder="请选择类型">
                <el-option label="模块" value='0'></el-option>
                <el-option label="菜单" value='1'></el-option>
                <el-option label="按钮" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级菜单">
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
        </el-row>
        <el-row :gutter="15">
          <el-col :span="11">
            <el-form-item label="序号">
              <el-input v-model="authorityForm.sort" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接口地址">
              <el-input v-model="authorityForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="saveChanges">保存</el-button>
    </span>
      </template>
    </el-dialog>

  </CommonLayout>
</template>

<script setup>
//引入
import CommonLayout from "@/components/base/CommonLayout.vue";
import {onMounted, reactive, ref, watchEffect} from 'vue';
import {ElMessage} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router';
import PaginationComponent from "@/components/util/PageComponent.vue";
import {AuthorityApi} from "@/baseConfig/system/authority.js";

const router = useRouter();
const records = ref([]);
const selectedRows = ref([]);
const currentPage = ref(1); // 当前页
const pageSize = ref(10); // 每页显示记录数
const totalRecords = ref(0); // 总记录数
const showDialog = ref(false);
const nameInput = ref('');

const authorityForm = reactive({
  name: '',
  code: '',
  parentId: 0,
  type: '',
  sort: '',
  url: '',
});

const params = reactive({
  name: '',
  current: 1,
  size: 10
});

//复选框
function handleSelectionChange(selected) {
  selectedRows.value = selected;
}

function parentChange(selectedValues) {
  authorityForm.parentId = selectedValues[selectedValues.length - 1];
}

//新增
function addRow() {
  authorityForm.name = '';
  authorityForm.code = '';
  authorityForm.parentId = 0;
  authorityForm.type = '';
  authorityForm.sort = '';
  authorityForm.url = '';
  fetchParentMenus();
  showDialog.value = true;
}

async function addAuthority() {
  await AuthorityApi.save(authorityForm)
  showDialog.value = false;
  await pageList();
}

// 显示编辑对话框
async function editRow(row) {
  await fetchParentMenus()
  let res = await findById(row.id);
  console.log(res.result)
  let type = res.result.type;
  authorityForm.type = type === 0 ? "模块" : type === 1 ? "菜单" : "按钮";
  authorityForm.id = res.result.id;
  authorityForm.name = res.result.name;
  authorityForm.code = res.result.code;
  authorityForm.sort = res.result.sort;
  authorityForm.url = res.result.url;
  authorityForm.parentId = res.result.parentId;
  showDialog.value = true;
}

// 保存更改
async function saveChanges() {
  try {
    authorityForm.type = authorityForm.type === '模块' ? 0 : authorityForm.type === '菜单' ? 1 : 2;
    const response = await AuthorityApi.update(authorityForm);
    if (response.code === 200) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.error(response.message);
    }
    showDialog.value = false;
    await pageList();
  } catch (error) {
    console.error(error);
  }
}

//删除
async function deleted(row) {
  let response = await AuthorityApi.delete(row.id);
  if (response.code === 200) {
    ElMessage.success('删除成功');
    pageList();
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
  const response = await AuthorityApi.findById(id);
  if (response.code === 200) {
    return response;
  } else {
    ElMessage.error(response.message);
  }
}

//分页查询
async function pageList() {
  const res = await AuthorityApi.getPage(params);
  records.value = res.result.records;
  totalRecords.value = res.result.total;
  records.value.forEach(item => {
    item.type = item.type === 0 ? "模块" : item.type === 1 ? "菜单" : "按钮";
  })
}


// 递归查找路径
function findPathById(options, id) {
  let path = [];

  function pageList(options) {
    for (const option of options) {
      if (option.id === id.toString()) {
        path = [option.id];
        return true;
      }
      if (option.children) {
        const found = pageList(option.children);
        if (found) {
          path = [option.id, ...path];
          return true;
        }
      }
    }
    return false;
  }
  pageList(options);
  return path;
}

const cascaderOptions = ref([]);
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
};

//请求父级菜单
async function fetchParentMenus() {
  const response = await AuthorityApi.findParent();
  if (response.code === 200) {
    cascaderOptions.value = response.result;
    return cascaderOptions.value;
  } else {
    ElMessage.error(response.message);
    return [];
  }
}

// 同步参数与输入框的值
watchEffect(() => {
  params.name = nameInput.value;
  params.current = currentPage.value;
  params.size = pageSize.value;
});

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


</style>
