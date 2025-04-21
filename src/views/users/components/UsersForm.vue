<template>
  <div class="user-info-page">
    <el-card class="user-info-card" shadow="hover">
      <el-descriptions
        title="用户信息"
        :column="3"
        :size="size"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <User />
              </el-icon>
              用户名
            </div>
          </template>
          {{ user.username }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              电话
            </div>
          </template>
          {{ user.phone }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Location />
              </el-icon>
              所在地
            </div>
          </template>
          杭州
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Star />
              </el-icon>
              会员等级
            </div>
          </template>
          {{ membershipLevel }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Tickets />
              </el-icon>
              预订次数
            </div>
          </template>
          {{ bookingCount }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Tickets />
              </el-icon>
              余额
            </div>
          </template>
          {{ user.balance }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { User, Iphone, Location, Tickets, Star } from '@element-plus/icons-vue'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const size = ref('default')
const iconStyle = computed(() => {
  const marginMap: Record<string, string> = { large: '8px', default: '6px', small: '4px' }
  return {
    marginRight: marginMap[size.value] || marginMap.default
  }
})

defineOptions({ name: 'UserInfo' })

// 静态补充信息
const membershipLevel = ref('金卡会员')
const bookingCount = ref(12)
</script>

<style scoped>
.user-info-page {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f7fa;
}

.user-info-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px;
}

.el-descriptions {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}
</style>