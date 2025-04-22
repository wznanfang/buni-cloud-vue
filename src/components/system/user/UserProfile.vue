<template>
  <CommonLayout>
    <el-card class="user-card" :body-style="{ padding: '50px' }">
      <div>
        <h2>个人中心</h2>
      </div>
      <div class="avatar-icon">
        <el-avatar class="myself-avatar" @click="selectAvatar" :src="avatarUrl"/>
        <input ref="fileInput" type="file" accept="image/*" style="display: none;" @change="changeAvatar"/>
      </div>
      <h3>个人信息</h3>
      <el-form
          ref="formRef"
          :model="mySelfInfo"
          :rules="formRules"
          label-width="100px"
          class="user-form">
        <el-row gutter="20">
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="mySelfInfo.username" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="mySelfInfo.name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="mySelfInfo.age" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="mySelfInfo.sex" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="mySelfInfo.tel" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="enable">
              <el-select v-model="mySelfInfo.enable" disabled>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="update-container">
        <el-button @click="saveChanges" class="editButton" type="primary">保存</el-button>
      </div>
      <h3>修改密码</h3>
      <el-form
          ref="formRef"
          :model="updatePassWordForm"
          :rules="updatePasswordRules"
          label-width="100px"
          class="user-form">
        <el-row gutter="20">
          <el-col :span="8">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="updatePassWordForm.oldPassword" show-password clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="updatePassWordForm.newPassword" show-password clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input v-model="updatePassWordForm.checkPassword" show-password clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="updatePassword-container">
        <el-button @click="updatePassword" class="updatePasswordButton" type="danger">修改</el-button>
      </div>
    </el-card>
  </CommonLayout>
</template>

<script setup lang="ts">
import CommonLayout from "@/components/base/CommonLayout.vue";
import {onMounted, reactive, ref} from 'vue';
import {ElCard, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow} from 'element-plus';
import {UserApi} from "@/baseConfig/system/user.js";
import {SystemFileApi} from "@/baseConfig/system/systemFile.js";
import {useUserStore} from '@/utils/userStore.js'
import {storeToRefs} from "pinia";

const userStore = useUserStore()

const {loginUser} = storeToRefs(userStore)
const formRef = ref() // 表单 Ref
const avatarUrl = ref('');

const mySelfInfo = ref({
  username: "",
  password: "",
  name: "",
  age: null,
  sex: 1,
  tel: "",
  enable: 0,
});

const formRules = reactive({
  username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
  name: [{required: true, message: '名字不能为空', trigger: 'blur'}],
  age: [{required: true, message: '年龄不能为空', trigger: 'blur'}],
  sex: [{required: true, message: '性别不能为空', trigger: 'blur'}],
  tel: [{required: true, message: '电话不能为空', trigger: 'blur'}],
  enable: [{required: true, message: '状态不能为空', trigger: 'blur'}],
})

const updatePassWordForm = reactive({
  id: loginUser.value.id,
  oldPassword: '',
  newPassword: '',
  checkPassword: '',
});

const updatePasswordRules = reactive({
  oldPassword: [{required: true, message: '旧密码不能为空', trigger: 'blur'}],
  newPassword: [{required: true, message: '新密码不能为空', trigger: 'blur'}],
  checkPassword: [
    {required: true, message: "请再次输入密码", trigger: "blur"},
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== updatePassWordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
})

onMounted(() => {
  myself()
});

//查询登录用户信息
async function myself() {
  const res = await UserApi.getUserInfo(loginUser.value.id);
  mySelfInfo.value = res.result;
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
  await UserApi.update(mySelfInfo.value)
  await myself();
  ElMessage.success('修改成功');
}

// 修改密码
async function updatePassword() {
  // 校验表单
  await formRef.value.validate()
  await UserApi.updatePassword(updatePassWordForm)
  //移除token缓存信息
  userStore.clearUser()
  ElMessage.success('修改成功，请重新登录');
}


</script>


<style scoped>

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
