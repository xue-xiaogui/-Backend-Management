import './assets/main.css'

import { createApp } from 'vue'
import { setupStore } from '@/stores'
import 'element-plus/dist/index.css'
// import { ElMessage, ElButton, ElForm, ElFormItem } from 'element-plus'

import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(router)
setupStore(app)
app.mount('#app')