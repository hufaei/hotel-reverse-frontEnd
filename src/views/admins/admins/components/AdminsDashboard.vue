<template>
  <div class="dashboard">
    <h1>Admins Dashboard</h1>
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="stat-card">
            <h2>Total Orders</h2>
            <p class="stat-value">{{ totalOrders }}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card">
            <h2>Total Revenue</h2>
            <p class="stat-value">{{ totalRevenue }}</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card">
            <h2>Customer Feedback</h2>
            <p class="stat-value">{{ customerFeedback }} / 5</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="recent-orders">
      <h2>近期成交</h2>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="paymentId" label="Payment ID" />
        <el-table-column prop="bookingId" label="Booking ID" />
        <el-table-column prop="amount" label="Amount" />
        <el-table-column prop="createdAt" label="Date" />
        <el-table-column prop="paymentStatus" label="Status" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPaymentDetailByHotel } from '@/api/modules/payment/payment'
import type { IPayment } from '@/api/interface/payment/payment'
import { useAdminStore } from '@/stores/hotelAdminStore'
const adminStore = useAdminStore()
const ownerHotelId = adminStore.user.ownerHotelId
// 模拟统计数据，前面三个暂时保留
const totalOrders = ref(150)
const totalRevenue = ref('￥250,000')
const customerFeedback = ref(4.7)

// 近期成交数据
const recentOrders = ref<IPayment.Row[]>([])

onMounted(async () => {
  if (!ownerHotelId) return
  try {
    const response = await getPaymentDetailByHotel({ id: ownerHotelId })
    // 接口返回的 Row[] 已按成交时间倒序
    recentOrders.value = response.data
  } catch (error) {
    console.error('获取近期成交数据失败：', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #2c3e50;
  color: #ecf0f1;
}

.dashboard h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #f39c12;
}

.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  background-color: #34495e;
  color: #ecf0f1;
  padding: 20px;
}

.stat-card h2 {
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
}

.recent-orders h2 {
  margin-bottom: 15px;
  color: #f39c12;
}

.el-table {
  background-color: #34495e;
}

.el-table th,
.el-table td {
  border-color: #7f8c8d;
}
</style>
