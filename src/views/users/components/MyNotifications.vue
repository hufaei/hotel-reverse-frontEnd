<template>
    <div class="notifications">
      <el-card
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-card"
        shadow="hover"
      >
        <div class="notification-header">
          <span class="notification-title">{{ notification.title }}</span>
          <span class="notification-time">{{ notification.time }}</span>
        </div>
        <div class="notification-content">
          <p>{{ notification.content }}</p>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Notification {
    id: number;
    title: string;
    content: string;
    time: string;
  }
  
  const notifications = ref<Notification[]>([
    {
      id: 1,
      title: '系统更新通知',
      content: '系统将在今晚23:00进行更新维护，预计停机10分钟，请提前做好准备。',
      time: '2025-04-09 21:23'
    },
    {
      id: 2,
      title: 'Test',
      content: '测试十分钟内发送通知1',
      time: '2025-04-08 18:31'
    },
    {
      id: 3,
      title: 'Raw',
      content: '修改密码成功',
      time: '2025-04-07 14:03'
    }
  ])
  </script>
  
  <style scoped>
  .notifications {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
  }
  
  .notification-card {
    margin-bottom: 20px;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .notification-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  .notification-time {
    font-size: 14px;
    color: #909399;
  }
  
  .notification-content p {
    margin: 0;
    font-size: 16px;
    color: #606266;
  }
  </style>
  