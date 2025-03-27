<template>
  <div class="main-container">
    <!-- 左侧导航 -->
    <div class="left-side">
      <!-- 用户信息区域 -->
      <div class="user-info">
        <div class="avatar-container">
          <el-avatar :size="80" :src="state.avatar" />
          <div class="user-name">姓名：{{ state.name }}</div>
          <div class="user-phone, user-address">电话：{{ state.phone }}</div>
          <div class="user-address">地址：{{ state.address }}</div>
          <div class="logout">
            <el-button type="danger" round @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <el-tabs v-model="activeTab" tab-position="left" class="demo-tabs">
          <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name">
            <template #label>
              <span class="tab-label">
                <el-icon><component :is="item.icon" /></el-icon>
                {{ item.label }}
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="right-content">
      <!-- 欢迎区域 -->
      <div class="welcome-card">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>欢迎回来，{{ state.name }}</span>
              <el-tag type="success">VIP用户</el-tag>
            </div>
          </template>
          <div class="quick-access">
            <el-statistic title="今日访问量" :value="568" />
            <el-statistic title="待办事项" :value="12" />
            <el-statistic title="消息通知" :value="3" />
          </div>
        </el-card>
      </div>

      <!-- 数据概览 -->
      <div class="data-overview">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in overviewData" :key="index">
            <el-card shadow="hover">
              <div class="overview-item">
                <div class="icon" :style="{ backgroundColor: item.color }">
                  <el-icon :size="24" color="white"><component :is="item.icon" /></el-icon>
                </div>
                <div class="info">
                  <div class="title">{{ item.title }}</div>
                  <div class="value">{{ item.value }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 最近活动 -->
      <div class="recent-activity">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { removeToken } from '@/utils/token'
import { profile } from '@/api/profile';
import { logout } from '@/api/logout';
import { useRouter } from 'vue-router';

import {
  User,
  Setting,
  Message,
  Ticket,
  Histogram,
  TrendCharts
} from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification } from 'element-plus';

const state = reactive({
  name: '',
  address: '',
  avatar: '',
  phone: ''
});



onMounted(async () => {
  // 初始化逻辑
  try {
    const { data } = await profile(null);
    state.name = data.data.name;
    state.address = data.data.address;
    state.avatar = data.data.avatar;
    state.phone = data.data.phone;
    console.log(state, 'state');
  } catch(error) {
    console.log(error);
  }
})
interface TabItem {
  name: string
  label: string
  icon: any
}

interface OverviewItem {
  title: string
  value: string | number
  icon: any
  color: string
}

interface Activity {
  content: string
  timestamp: string
}

const activeTab = ref('profile')
const router = useRouter();
const tabs = [
  { name: 'profile', label: '个人中心', icon: User },
  { name: 'settings', label: '系统设置', icon: Setting },
  { name: 'messages', label: '消息中心', icon: Message },
  { name: 'orders', label: '订单管理', icon: Ticket }
]

const overviewData = [
  { title: '总用户数', value: '2,845', icon: User, color: '#409EFF' },
  { title: '本月销售额', value: '¥ 45,200', icon: TrendCharts, color: '#67C23A' },
  { title: '待处理订单', value: '18', icon: Histogram, color: '#E6A23C' }
]

const activities = [
  { content: '用户张三提交了新订单', timestamp: '2024-02-20 14:00' },
  { content: '系统版本更新至2.1.0', timestamp: '2024-02-19 09:30' },
  { content: '完成月度数据备份', timestamp: '2024-02-18 18:15' }
]

const handleLogout = () => {
  
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const log = await logout();
      if (log.data.code === 10000) {
        removeToken()
        router.replace('/login')
        ElNotification({
          title: log.data.message,
          message: '',
          type: 'success',
        })
      }
    } catch (error) {
      console.log(error);
    }
  })
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;

  .left-side {
    width: 260px;
    background-color: #fff;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);

    .user-info {
      padding: 20px;
      border-bottom: 1px solid #ebeef5;

      .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        .user-name, .user-phone, .user-address {
          font-size: 12px;
          margin: 1px 0;
        }
        .logout {
          width: 100%;
          text-align: center;
        }
      }
    }

    .nav-menu {
      :deep(.el-tabs) {
        height: calc(100vh - 180px);

        .el-tabs__header {
          margin-right: 0;
        }

        .el-tabs__item {
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;

          .tab-label {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }
    }
  }

  .right-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .welcome-card {
      margin-bottom: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .quick-access {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
      }
    }

    .data-overview {
      margin-bottom: 20px;

      .overview-item {
        display: flex;
        align-items: center;
        gap: 15px;

        .icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info {
          .title {
            color: #909399;
            margin-bottom: 4px;
          }

          .value {
            font-size: 18px;
            font-weight: 600;
          }
        }
      }
    }

    .recent-activity {
      :deep(.el-timeline) {
        padding-left: 20px;
      }
    }
  }
}
</style>