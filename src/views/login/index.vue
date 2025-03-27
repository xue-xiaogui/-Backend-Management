<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <h1 class="title">Admin System</h1>
        <p class="subtitle">Management System Login</p >
      </div>

      <el-form
        ref="loginFormRef"
        :model="formData"
        :rules="formRules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="Username"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="Password"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          Sign In
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification, type FormInstance } from 'element-plus'
import { setToken, getToken } from '@/utils/token'

// import { useUserStore } from '@/stores/modules/user'
import { login } from '@/api/login'
// const userStore = useUserStore()


interface LoginForm {
  username: string
  password: string
}

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<LoginForm>({
  username: '',
  password: ''
})

// const login = (formData: any) => userStore.login(formData)
const formRules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate(async (valid) => {
      if (valid)
        try {
          const { data } = await login(formData)
          // 判断登陆是否成功
          console.log(data, 'data');
          setToken(data.data.token, '')
          if (data.code === 10000) {
            ElNotification({
              title: '登陆成功',
              message: '欢迎来到后台管理系统！',
              type: 'success',
            })
          } else {
            ElNotification({
              title: '登陆失败',
              message: '登陆失败请重新登录！',
              type: 'error',
            })
          }
        } catch (error) {
          ElNotification({
            title: 'Error',
            message: '账号或密码错误，请重新输入！',
            type: 'error',
          })
        }
    })
    loading.value = true
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/index')
  } catch (error) {
    ElNotification({
      title: 'Error',
      message: '请您输入用户名和密码！',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow:  0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  .header {
    text-align: center;
    margin-bottom: 36px;
    
    .title {
      color: #409eff;
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .subtitle {
      color: #909399;
      font-size: 14px;
    }
  }
}

.login-btn {
  width: 100%;
  margin-top: 12px;
  font-size: 20px;
  letter-spacing: 2px;
}

:deep(.el-input__inner) {
  height: 44px;
}
</style>