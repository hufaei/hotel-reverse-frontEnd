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
        <el-table-column prop="orderId" label="Order ID"  />
        <el-table-column prop="customer" label="Customer" />
        <el-table-column prop="date" label="Date"  />
        <el-table-column prop="amount" label="Amount"  />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 造数据
const totalOrders = ref(150)
const totalRevenue = ref('￥250,000')
const customerFeedback = ref(4.7)
const recentOrders = ref([
  { orderId: '00123', customer: 'John Doe', date: '2023-04-01', amount: '￥1500' },
  { orderId: '00124', customer: 'Jane Smith', date: '2023-04-02', amount: '￥1800' },
  { orderId: '00125', customer: 'Alice Johnson', date: '2023-04-03', amount: '￥1200' },
  { orderId: '00126', customer: 'Bob Brown', date: '2023-04-04', amount: '￥2000' },
])
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
