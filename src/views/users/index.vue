<template>
  <div class="index-container">
    <el-row>
      <!-- 左侧菜单区域 -->
      <el-col :span="4">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item index="orders">我的订单</el-menu-item>
          <el-menu-item index="profile">个人信息</el-menu-item>
          <el-menu-item index="security">账号安全</el-menu-item>
          <el-menu-item index="favorites">我的收藏</el-menu-item>
          <el-menu-item index="notifications">我的通知</el-menu-item>
        </el-menu>
      </el-col>
      <!-- 右侧内容区域 -->
      <el-col :span="20">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const activeMenu = ref('orders')
const router = useRouter()
const route = useRoute()

// 初始化时根据当前路径设置 activeMenu
onMounted(() => {
  const segments = route.path.split('/')
  activeMenu.value = segments[2] || 'orders'
})

// 监控路由变化，实时更新 activeMenu
watch(() => route.path, (newPath) => {
  const segments = newPath.split('/')
  activeMenu.value = segments[2] || 'orders'
})

const handleMenuSelect = (key: string) => {
  activeMenu.value = key
  router.push(`/user/${key}`)
}
</script>

<style scoped>
.index-container {
  padding: 20px;
}
.el-menu-vertical-demo {
  width: 100%;
  min-height: 400px;
}
</style>
