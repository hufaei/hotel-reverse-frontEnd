<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <!-- 全部订单 -->
      <el-tab-pane label="全部订单" name="first">
        <div
          v-for="order in allOrders"
          :key="order.booking.bookingId"
          class="order-item"
        >
          <img
            class="room-image"
            :src="order.roomImage"
            alt="房间图片"
            v-if="order.roomImage"
            @click="handleRoomClick(order.booking.hotelId)"
          />
          <div class="order-details">
            <p class="order-info">
              <span class="label">酒店名称：</span>{{ order.hotelName }}
            </p>
            <p class="order-info">
              <span class="label">房间名称：</span>{{ order.roomName }}
            </p>
            <p class="order-info">
              <span class="label">订单金额：</span>
              {{ order.payment?.amount + '￥' || '待定' }}
            </p>
            <div class="order-status">
              <span class="label">订单状态：</span>{{ orderStatus(order) }}
            </div>
            <div class="time-info">
              <p>下单时间：{{ order.booking.createdAt }}</p>
              <p v-if="order.payment?.paymentStatus==='PAID' && order.payment.createdAt">
                支付流水创建：{{ order.payment.createdAt }}
              </p>
            </div>
          </div>
          <!-- 操作按钮区域，位于订单项右下角 -->
          <div class="order-actions">
            <!-- 未出行：预订状态为 CONFIRMED且支付单已支付 显示取消按钮 -->
            <mi-button
              v-if="order.booking.status === 'CONFIRMED' && order.payment?.paymentStatus === 'PAID'"
              :text="cancelText"
              @click="openCancelDialog(order)"
            />
            <!-- 待付款：订单状态为 UNPAID 显示去支付按钮 -->
            <mi-button
              v-if="order.payment?.paymentStatus === 'UNPAID'"
              :text="payText"
              :link="order.payLink"
            />
            <!-- 待评价：支付单\预订单状态 FINISHED 且未评价显示评价按钮 -->
            <mi-button
              v-if="order.booking.status === 'FINISHED' && !order.booking.isReview && order.payment?.paymentStatus === 'FINISHED' "
              :circle="false"
              :radius="4"
              :text="reviewText"
              :link="order.reviewLink"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 未出行：订单状态为 CONFIRMED -->
      <el-tab-pane label="未出行" name="second">
        <div
          v-for="order in toGoOrders"
          :key="order.booking.bookingId"
          class="order-item"
        >
          <img
            class="room-image"
            :src="order.roomImage"
            alt="房间图片"
            v-if="order.roomImage"
            @click="handleRoomClick(order.booking.hotelId)"
          />
          <div class="order-details">
            <p class="order-info">
              <span class="label">酒店名称：</span>{{ order.hotelName }}
            </p>
            <p class="order-info">
              <span class="label">房间名称：</span>{{ order.roomName }}
            </p>
            <p class="order-info">
              <span class="label">订单金额：</span>
              {{ order.payment?.amount + '￥' || '待定' }}
            </p>
            <div class="order-status">
              <span class="label">订单状态：</span>{{ orderStatus(order) }}
            </div>
            <div class="time-info">
              <p>下单时间：{{ order.booking.createdAt }}</p>
              <p v-if="order.payment && order.payment.createdAt">
                支付时间：{{ order.payment.createdAt }}
              </p>
            </div>
          </div>
          <div class="order-actions">
            <mi-button
              v-if="order.booking.status === 'CONFIRMED'"
              :text="cancelText"
              :link="order.reviewLink"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 待付款：订单状态为 UNPAID -->
      <el-tab-pane label="待付款" name="third">
        <div
          v-for="order in toPayOrders"
          :key="order.booking.bookingId"
          class="order-item"
        >
          <img
            class="room-image"
            :src="order.roomImage"
            alt="房间图片"
            v-if="order.roomImage"
            @click="handleRoomClick(order.booking.hotelId)"
          />
          <div class="order-details">
            <p class="order-info">
              <span class="label">酒店名称：</span>{{ order.hotelName }}
            </p>
            <p class="order-info">
              <span class="label">房间名称：</span>{{ order.roomName }}
            </p>
            <p class="order-info">
              <span class="label">订单金额：</span>
              {{ order.payment?.amount + '￥' || '待定' }}
            </p>
            <div class="order-status">
              <span class="label">订单状态：</span>{{ orderStatus(order) }}
            </div>
            <div class="time-info">
              <p>下单时间：{{ order.booking.createdAt }}</p>
              <p v-if="order.payment && order.payment.createdAt">
                支付时间：{{ order.payment.createdAt }}
              </p>
            </div>
          </div>
          <div class="order-actions">
            <mi-button :text="payText" :link="order.payLink" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 待评价：订单状态为 FINISHED 且未评价 -->
      <el-tab-pane label="待评价" name="fourth">
        <div
          v-for="order in toFeedbackOrders"
          :key="order.booking.bookingId"
          class="order-item"
        >
          <img
            class="room-image"
            :src="order.roomImage"
            alt="房间图片"
            v-if="order.roomImage"
            @click="handleRoomClick(order.booking.hotelId)"
          />
          <div class="order-details">
            <p class="order-info">
              <span class="label">酒店名称：</span>{{ order.hotelName }}
            </p>
            <p class="order-info">
              <span class="label">房间名称：</span>{{ order.roomName }}
            </p>
            <p class="order-info">
              <span class="label">订单金额：</span>
              {{ order.payment?.amount + '￥' || '待定' }}
            </p>
            <div class="order-status">
              <span class="label">订单状态：</span>{{ orderStatus(order) }}
            </div>
            <div class="time-info">
              <p>下单时间：{{ order.booking.createdAt }}</p>
              <p v-if="order.payment && order.payment.createdAt">
                支付时间：{{ order.payment.createdAt }}
              </p>
            </div>
          </div>
          <div class="order-actions">
            <mi-button
              :circle="false"
              :radius="4"
              :text="reviewText"
              :link="order.reviewLink"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import {
  getBookingsListApi,
  cancelBookingsApi
} from '@/api/modules/bookings/bookings'
import { getPaymentDetailByBooking } from '@/api/modules/payment/payment'
import { getHotelsDetailApi } from '@/api/modules/hotels/hotels'
import { getRoomTypesDetailApi } from '@/api/modules/roomtypes/roomTypes'
import type { IBookings } from '@/api/interface/bookings/bookings'
import type { IPayment } from '@/api/interface/payment/payment'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { TextSetting } from '@miitvip/admin-pro'
import { pa } from 'element-plus/es/locale/index.mjs'

// 订单项数据结构：包含预订、支付、酒店、房型信息
interface OrderItem {
  booking: IBookings.Row
  payment: IPayment.Row | null
  hotelName?: string
  roomName?: string
  roomImage?: string
  reviewLink?: string
  payLink?: string
}

const activeName = ref('first')
const orderList = ref<OrderItem[]>([])
const router = useRouter()

// 定义按钮的文本样式配置
const cancelText = ref<TextSetting>({
  text: '取消订单',
  color: 'darkgrey',
  size: 16,
  bold: true
})
const payText = ref<TextSetting>({
  text: '去支付',
  color: 'darkgrey',
  size: 16,
  bold: true
})
const reviewText = ref<TextSetting>({
  text: '评价',
  color: 'darkgrey',
  size: 16,
  bold: true
})

// 处理 Tab 点击事件
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event)
}

// 获取当前用户的订单数据
const fetchOrders = async () => {
  const userStore = useUserStore()
  const userId = userStore.user?.userId
  if (!userId) return

  try {
    // 调用预订接口，假设返回结构为 { rows: IBookings.Row[], total: number }
    const bookingsResponse = await getBookingsListApi({ userId, limit: 10, page: 1 })
    if (bookingsResponse?.data) {
      const bookings: IBookings.Row[] = bookingsResponse.data.rows
       const orders: OrderItem[] = []
       for (const booking of bookings) {
         // 1. 支付详情
         let payment: IPayment.Row | null = null
         if (booking.bookingId) {
           const paymentResponse = await getPaymentDetailByBooking({ id: booking.bookingId })
           payment = paymentResponse?.data || null
         }
      
         // 2. 酒店 & 房型详情（依次请求）
         let hotelName = ''
         let roomName  = ''
         let roomImage = ''
         if (booking.hotelId && booking.roomTypeId) {
           const hotelRes    = await getHotelsDetailApi({ id: booking.hotelId })
           const roomTypeRes = await getRoomTypesDetailApi({ id: booking.roomTypeId })
           hotelName = hotelRes?.data?.hotelName || ''
           roomName  = roomTypeRes?.data?.roomType    || ''
           roomImage = roomTypeRes?.data?.photoUrls   || ''
         }
      
         // 3. 组装并推入结果数组
         orders.push({
           booking,
           payment,
           hotelName,
           roomName,
           roomImage,
           reviewLink: `/reviews/${booking.bookingId}`,
           payLink: `/payment?bookingId=${booking.bookingId}`
         })
       }
      orderList.value = orders
    }
  } catch (error) {
    console.error('获取订单数据失败：', error)
  }
}
const handleRoomClick = async (params: any) => {
  router.push({path:`/hotels/${params}`})
}
onMounted(() => {
  fetchOrders()
})

// 取消订单：使用 Element Plus MessageBox.prompt 获取取消原因后调用 cancelBookingsApi
const openCancelDialog = (order: OrderItem) => {
  ElMessageBox.prompt('请输入取消原因', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '取消原因不能为空'
  })
    .then(({ value }) => {
      cancelBookingsApi({
        bookingId: order.booking.bookingId || 0,
        reason: value
      })
        .then(() => {
          ElMessage.success('订单已取消')
          fetchOrders() // 重新加载订单数据
        })
        .catch(() => {
          ElMessage.error('取消订单失败')
        })
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 根据订单状态返回对应的文字显示
const orderStatus = (order: OrderItem): string => {

  console.log(order.payLink,"pay状态："+order.payment?.paymentStatus+"booking状态"+order.booking.status)
  if (order.payment?.paymentStatus === 'UNPAID') return '待付款'
  if (order.booking.status === 'CONFIRMED' && order.payment?.paymentStatus === 'PAID') return '未出行'
  if (order.booking.status === 'FINISHED' && order.payment?.paymentStatus === 'FINISHED') {
    return order.booking.isReview ? '已完成' : '待评价'
  }
  if (order.booking.status === 'CANCELED' && order.payment?.paymentStatus === 'CANCEL') return '已取消'
  return '待确认'
}

// 计算属性：根据订单状态进行过滤
const allOrders = computed(() => orderList.value)
const toPayOrders = computed(() =>
  orderList.value.filter(order => order.payment?.paymentStatus === 'UNPAID')
)
const toGoOrders = computed(() =>
  orderList.value.filter(order => order.booking.status === 'CONFIRMED' && order.payment?.paymentStatus === 'PAID')
)
const toFeedbackOrders = computed(() =>
  orderList.value.filter(
    order => order.booking.status === 'FINISHED' && !order.booking.isReview && order.payment?.paymentStatus === 'FINISHED'
  )
)
</script>

<style scoped>
.demo-tabs {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
}

.order-item {
  position: relative;
  display: flex;
  border: 1px solid #ebeef5;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.room-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  margin-right: 16px;
  border-radius: 4px;
}

.order-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-info {
  margin: 4px 0;
  font-size: 14px;
  color: #333;
}

.label {
  font-weight: bold;
  margin-right: 4px;
}

/* 状态及时间样式 */
.order-status {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}

.time-info {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 按钮区域绝对定位在订单项右下角 */
.order-actions {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
}
</style>
