<template>
  <div class="order-page">
    <h3 class="order-page__title">订单管理</h3>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="paymentId" label="支付单ID" width="120" />
      <el-table-column prop="bookingId" label="预订ID" width="120" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="paymentStatus" label="支付状态" width="120" />
      <el-table-column prop="reason" label="原因" />
      <el-table-column prop="createdAt" label="支付时间" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBookingsListApi } from '@/api/modules/bookings/bookings'
import type { IBookings } from '@/api/interface/bookings/bookings'
import { getPaymentDetailByBooking } from '@/api/modules/payment/payment'
import type { IPayment } from '@/api/interface/payment/payment'

const tableData = ref<IPayment.Row[]>([])

const fetchOrders = async () => {
  try {
    // 查询预订单列表（这里只取bookingId，可根据需求传入其他参数）
    const res = await getBookingsListApi({})
    if (res?.data) {
      const bookings: IBookings.Row[] = res.data.rows || []
      // 对每个预订单调用 getPaymentDetailByBooking 获取支付详情
      const paymentDetails = await Promise.all(
        bookings.map(async booking => {
          if (booking.bookingId) {
            try {
              const paymentRes = await getPaymentDetailByBooking({ id: booking.bookingId })
              if (paymentRes?.data) {
                return paymentRes.data
              }
            } catch (error) {
              console.error(`获取预订 ${booking.bookingId} 的支付详情失败`, error)
            }
          }
          return null
        })
      )
      // 过滤掉空数据
      tableData.value = paymentDetails.filter(item => item !== null) as IPayment.Row[]
    }
  } catch (error) {
    console.error('获取订单失败', error)
    ElMessage.error('获取订单失败')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-page {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7); /* 深色透明背景 */
}

.order-page__title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffcc00;
}

/* 覆盖 el-table 默认样式 */
.el-table {
  background-color: transparent !important;
}
.el-table th,
.el-table td {
  background-color: transparent !important;
  color: #fff !important;
}
</style>
