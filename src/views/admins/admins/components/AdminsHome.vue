<template>
  <div class="frontdesk-home">
    <!-- 顶部欢迎横幅 -->
    <el-row gutter="20">
      <el-col :span="24">
        <div class="dashboard-banner">
          <h1>酒店前台管理系统</h1>
          <p>欢迎来到前台管理平台，这里您可以查看预订单信息、处理客户入住等。</p>
        </div>
      </el-col>
    </el-row>
    <!-- 统计数据卡片 -->
    <el-row gutter="20" class="dashboard-statistics">
      <el-col :span="8">
        <el-card class="dashboard-card">
          <h2>总预订</h2>
          <div class="card-content">
            <p>{{totalOrders}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="dashboard-card">
          <h2>总收入</h2>
          <div class="card-content">
            <p>{{sum}}￥</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="dashboard-card">
          <h2>客户反馈</h2>
          <div class="card-content">
            <p>4.5/5 星</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 最新预订单信息（单列展示前三条） -->
    <el-row gutter="20" class="dashboard-section">
      <el-col :span="24">
        <el-card class="dashboard-card">
          <h2>最新预订单</h2>
          <ul class="list">
            <li v-for="item in recentOrders" :key="item.bookingId">
              <span class="user-name">{{ item.username }}</span>
              - <span class="room-type">{{ item.roomType }}</span>
              - <span class="user-phone">{{ item.userPhone }}</span>
              - <span class="order-time">下单：{{ item.createdAt }}</span>
              - <span class="amount">{{ item.amount ? item.amount + '￥' : '待定' }}</span>
              - <span class="pay-status">{{ item.paymentStatus === 'FINISHED' ? '已支付' : '未支付' }}</span>
            </li>
          </ul>
          <div class="book-more">
            <mi-button :text="text" :width="320" link="/admins/reverse" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookingsListApi } from '@/api/modules/bookings/bookings'
import type { IBookings } from '@/api/interface/bookings/bookings'
import { getUsersDetailApi } from '@/api/modules/users/users'
import type { IUsers } from '@/api/interface/users/users'
import { getRoomTypesDetailApi } from '@/api/modules/roomtypes/roomTypes'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'
import { getPaymentDetailByBooking } from '@/api/modules/payment/payment'
import type { IPayment } from '@/api/interface/payment/payment'
import type { TextSetting } from '@miitvip/admin-pro'

// 定义展示订单数据的类型
interface OrderItemDisplay {
  bookingId: number
  username: string
  userPhone: string
  roomType: string
  createdAt: string
  amount?: number
  paymentStatus?: string
}

// 总订单数和展示的前三条订单数据
const totalOrders = ref(0)
let sum = ref<number>(0)
const recentOrders = ref<OrderItemDisplay[]>([])

// 定义“查看更多”按钮的文本配置
const text = ref<TextSetting>({
  text: '查看更多',
  size: 18,
  bold: true
})

// 获取预订单数据
onMounted(async () => {
  try {
    // 传入空参数，查询所有预订单
    const res = await getBookingsListApi({
      page: 1,
      limit: 3
    })
    if (res?.data) {
      totalOrders.value = res.data.total || 0
      const bookings: IBookings.Row[] = res.data.rows
      // 对每个预订单查询用户详情、房型详情、支付详情
      const orders: OrderItemDisplay[] = await Promise.all(
        bookings.map(async booking => {
          // 用户详情：获取用户名称和手机号
          let username = booking.username || ''
          let userPhone = booking.userPhone || ''
          if (booking.userId) {
            try {
              const userRes = await getUsersDetailApi({ id: booking.userId })
              if (userRes?.data) {
                username = userRes.data.username || username
                userPhone = userRes.data.phone || userPhone
              }
            } catch (error) {
              console.error('获取用户详情失败', error)
            }
          }
          // 房型详情：获取房型名称
          let roomType = ''
          if (booking.roomTypeId) {
            try {
              const roomTypeRes = await getRoomTypesDetailApi({ id: booking.roomTypeId })
              if (roomTypeRes?.data) {
                roomType = roomTypeRes.data.roomType || ''
              }
            } catch (error) {
              console.error('获取房型详情失败', error)
            }
          }
          // 支付详情：获取金额及支付状态
          let amount: number | undefined = undefined
          let paymentStatus: string | undefined = undefined
          if (booking.bookingId) {
            try {
              const paymentRes = await getPaymentDetailByBooking({ id: booking.bookingId })
              if (paymentRes?.data) {
                amount = paymentRes.data.amount
                sum.value += paymentRes.data?.amount || 0
                paymentStatus = paymentRes.data.paymentStatus
              }
            } catch (error) {
              console.error('获取支付详情失败', error)
            }
          }
          return {
            bookingId: booking.bookingId || 0,
            username,
            userPhone,
            roomType,
            createdAt: booking.createdAt || '',
            amount,
            paymentStatus
          }
        })
      )
      recentOrders.value = orders
    }
  } catch (error) {
    console.error('查询预订单失败：', error)
  }
})
</script>

<style scoped>
.frontdesk-home {
  padding: 20px;
  background-color: #313130;
  color: #fff;
}

/* 顶部横幅 */
.dashboard-banner {
background-color:  rgba(47, 31, 9, 0.2);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-banner h1 {
  margin: 0 0 10px;
  font-size: 28px;
}

.dashboard-banner p {
  margin: 0;
  font-size: 16px;
}

/* 统计数据卡片 */
.dashboard-statistics {
  margin-left: 30px;
  margin-bottom: 20px;
}

.dashboard-card {
  background-color: rgba(47, 31, 9, 0.2);
  color: #fcfcfc;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
}

.dashboard-card h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.card-content p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

/* 最新预订单 */
.dashboard-section {
  margin-bottom: 20px;
}

.dashboard-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.list li:last-child {
  border-bottom: none;
}

.order-id {
  font-weight: bold;
  margin-right: 6px;
}

.user-name,
.room-type,
.user-phone,
.order-time,
.amount,
.pay-status {
  margin-right: 8px;
}

.book-more {
  margin-top: 15px;
  text-align: right;
}
</style>
