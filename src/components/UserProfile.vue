<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="user-card" :body-style="{ padding: '20px' }">
      <h2>个人信息</h2>
      <el-form label-width="100px" class="user-form">
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="用户名">
              <el-input v-model="mySelfInfo.username" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名">
              <el-input v-model="mySelfInfo.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="年龄">
              <el-input v-model="mySelfInfo.age"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别">
              <el-select v-model="mySelfInfo.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="电话">
              <el-input v-model="mySelfInfo.tel"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态">
              <el-input v-model="mySelfInfo.enable" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <el-button @click="saveChanges" class="editButton" type="primary">保存</el-button>
      </div>
    </el-card>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from "@/components/CommonLayout.vue";

import {ref, onMounted} from 'vue';
import {ElCard, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElMessage} from 'element-plus';
import {useStore} from 'vuex';
import axios from "axios";
import {API_BASE_URL} from "@/config.js";

const loginUser = JSON.parse(localStorage.getItem('loginUser'));
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;
const store = useStore();
const mySelfInfo = ref({});

onMounted(() => {
  myself()
});

function myself() {
  const id = loginUser.id;
  return axios.get(`${API_BASE_URL}/user/v1/user/${id}`, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      mySelfInfo.value = response.data.result;
      mySelfInfo.value.enable = mySelfInfo.value.enable === 1 ? '启用' : '禁用';
      mySelfInfo.value.sex = mySelfInfo.value.sex === 1 ? '男' : '女';
      store.commit('myself', mySelfInfo.value);
      return response;
    } else {
      ElMessage.error('获取个人信息失败');
    }
  })
}

function saveChanges() {
  mySelfInfo.value.sex = mySelfInfo.value.sex === '男' || mySelfInfo.value.sex === '1' ? 1 : 0;
  mySelfInfo.value.enable = mySelfInfo.value.enable === '启用' || mySelfInfo.value.enable === '1' ? 1 : 0;
  axios.put(`${API_BASE_URL}/user/v1/user`, mySelfInfo.value, {
    headers: {
      'Authorization': token
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('修改成功');
      myself();
    } else {
      ElMessage.error('修改失败');
    }
  })
}

</script>


<style scoped>

.breadcrumb {
  margin: 30px 0 20px 20px;
  font-size: 16px;
}

.user-card {
  position: relative;
  margin: 20px 20px;
}


.user-form {
  margin-left: 100px;
  margin-bottom: 50px;
}

.button-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.editButton {
  display: flex;
  margin-right: 50px;
}

</style>