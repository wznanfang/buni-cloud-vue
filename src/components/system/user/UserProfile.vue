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
import {UserApi} from "@/baseConfig/system/user.js";
import {SystemFileApi} from "@/baseConfig/system/systemFile.js";
import {useUserStore} from '@/utils/userStore.js'
import {storeToRefs} from "pinia";

const userStore = useUserStore()

const {loginUser} = storeToRefs(userStore)

const mySelfInfo = ref({});
const avatarUrl = ref('');

onMounted(() => {
  myself()
});

//查询登录用户信息
async function myself() {
  const res = await UserApi.getUserInfo(loginUser.value.id);
  mySelfInfo.value = res.result;
  mySelfInfo.value.enable = mySelfInfo.value.enable === 1 ? '启用' : '禁用';
  mySelfInfo.value.sex = mySelfInfo.value.sex === 1 ? '男' : '女';
  avatarUrl.value = mySelfInfo.value.avatar;
}

function selectAvatar() {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
}

// 修改头像
async function changeAvatar(event) {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    let res = await SystemFileApi.upload(formData);
    const body = {
      id: loginUser.id,
      avatar: res.result
    }
    await UserApi.editAvatar(body)
    await myself();
    ElMessage.success('修改成功');
  }
}

// 修改用户信息
async function saveChanges() {
  mySelfInfo.value.sex = mySelfInfo.value.sex === '男' || mySelfInfo.value.sex === '1' ? 1 : 0;
  mySelfInfo.value.enable = mySelfInfo.value.enable === '启用' || mySelfInfo.value.enable === '1' ? 1 : 0;
  await UserApi.update(mySelfInfo.value)
  await myself();
  ElMessage.success('修改成功');
}

const updatePassWordForm = reactive({
  id: loginUser.value.id,
  oldPassword: '',
  newPassword: '',
});

// 修改密码
async function updatePassword() {
  await UserApi.updatePassword(updatePassWordForm)
  //移除token缓存信息
  userStore.clearUser()
  ElMessage.success('修改成功，请重新登录');
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
