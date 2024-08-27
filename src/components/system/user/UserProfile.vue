<template>
  <CommonLayout>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="user-card" :body-style="{ padding: '50px' }">
      <div class="avatar-icon">
        <el-avatar class="myself-avatar" :src="avatarUrl"/>
        <el-button class="edit-avatar" @click="selectAvatar" type="primary" plain>修改头像</el-button>
        <input ref="fileInput" type="file" accept="image/*" style="display: none;" @change="changeAvatar"/>
      </div>
      <h2>个人信息</h2>
      <el-form label-width="100px" class="user-form">
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="用户名">
              <el-input v-model="mySelfInfo.username" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名">
              <el-input v-model="mySelfInfo.name" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="年龄">
              <el-input v-model="mySelfInfo.age" clearable/>
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
              <el-input v-model="mySelfInfo.tel" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态">
              <el-input v-model="mySelfInfo.enable" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="update-container">
        <el-button @click="saveChanges" class="editButton" type="primary">保存</el-button>
      </div>
      <h2>修改密码</h2>
      <el-form :model="updatePassWordForm" label-width="100px" class="user-form">
        <el-row gutter="20">
          <el-col :span="10">
            <el-form-item label="旧密码">
              <el-input v-model="updatePassWordForm.oldPassword" show-password clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="新密码">
              <el-input v-model="updatePassWordForm.newPassword" show-password clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="updatePassword-container">
        <el-button @click="updatePassword" class="updatePasswordButton" type="danger">修改密码</el-button>
      </div>
    </el-card>
  </CommonLayout>
</template>

<script setup>
import CommonLayout from "@/components/base/CommonLayout.vue";

import {onMounted, reactive, ref} from 'vue';
import {ElCard, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow} from 'element-plus';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import axios from "axios";
import {API_BASE_URL} from "@/config.js";
import {logout, getUserInfo} from "@/baseConfig/auth.js";

const router = useRouter();
const loginUser = JSON.parse(localStorage.getItem('loginUser'));
const tokenVO = JSON.parse(localStorage.getItem('authToken'));
const token = 'bearer ' + tokenVO.token;
const store = useStore();
const mySelfInfo = ref({});
const avatarUrl = ref('');

onMounted(() => {
  myself()
});

function myself() {
  getUserInfo(loginUser.id, token).then(result => {
    mySelfInfo.value = result;
    mySelfInfo.value.enable = mySelfInfo.value.enable === 1 ? '启用' : '禁用';
    mySelfInfo.value.sex = mySelfInfo.value.sex === 1 ? '男' : '女';
    store.commit('myself', mySelfInfo.value);
    avatarUrl.value = result.avatar;
    loginUser.avatar = result.avatar;
  })
}

function selectAvatar() {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
}

function changeAvatar(event) {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    axios.post(`${API_BASE_URL}/file/v1/upload`, formData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.code === 200) {
        editUserAvatar(response.data.result);
      } else {
        ElMessage.error('修改失败');
      }
    })
  }
}

function editUserAvatar(avatar) {
  const body = {
    id: loginUser.id,
    avatar: avatar
  }
  axios.put(`${API_BASE_URL}/user/v1/user/avatar`, body, {
    headers: {
      'Authorization': token,
    }
  }).then(async response => {
    if (response.data.code === 200) {
      ElMessage.success('修改成功');
      await myself()
    } else {
      ElMessage.error('修改失败');
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

const updatePassWordForm = reactive({
  id: loginUser.id,
  oldPassword: '',
  newPassword: '',
});

function updatePassword() {
  axios.put(`${API_BASE_URL}/user/v1/user/password`, updatePassWordForm, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.data.code === 200) {
      ElMessage.success('修改成功');
      logout(router);
    } else {
      ElMessage.error(response.data.message);
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

.avatar-icon {
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 150px;
}

.myself-avatar {
  display: block;
  margin: 0 auto;
  width: 100px;
  height: 100px;
}

.edit-avatar {
  display: block;
  margin: 10px auto;
  height: 35px;
}


.user-form {
  margin: 50px 0 20px 100px;
}

.update-container, .updatePassword-container {
  bottom: 20px;
  right: 20px;
  margin-left: 150px;
}

.editButton, .updatePasswordButton {
  display: flex;
  height: 35px;
}

</style>