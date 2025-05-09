<template>
  <div class="reverse-ctrl">
    <h3 class="reverse-ctrl__title">Reverse: 预订管理</h3>
    <el-table :data="bookingList" style="width: 100%">
      <el-table-column prop="bookingId" label="预订ID" />
      <el-table-column prop="username" label="预订用户" />
      <el-table-column prop="createdAt" label="预订时间"/>
      <el-table-column prop="roomTypeName" label="预订房型" />
      <el-table-column label="操作" >
        <template #default="scope">
          <template v-if="scope.row.status === 'PENDING_CONFIRMATION'">
            <el-button
              type="primary"
              @click="handleConfirm(scope.row)"
            >确认</el-button>
          </template>
          <template v-else>
            <span>{{ statusText(scope.row.status) }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="totalBookings"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBookingsListApi, confirmBookingsApi } from '@/api/modules/bookings/bookings'
import type { IBookings } from '@/api/interface/bookings/bookings'
import { getRoomTypesDetailApi } from '@/api/modules/roomtypes/roomTypes'
import { getUsersDetailApi } from '@/api/modules/users/users'

import { useAdminStore } from '@/stores/hotelAdminStore'

const adminStore = useAdminStore()
const ownerHotelId = adminStore.user.ownerHotelId
const currentPage = ref(1)
const totalBookings = ref(0)
const bookingList = ref<Array<any>>([])

const fetchBookings = async (page: number) => {
  try {
    // 查询预订单（传入 hotelId、limit=10、page）
    const res = await getBookingsListApi({ hotelId:ownerHotelId, limit: 10, page })
    console.log(res.data)
    if (res?.data) {
      totalBookings.value = res.data.total || 0
      const bookings: IBookings.Row[] = res.data.rows || []
      // 针对每条预订单查询房型详情及用户详情
      const bookingsWithDetails = await Promise.all(
        bookings.map(async booking => {
          let roomTypeName = ''
          let username = ''
          // 获取房型详情
          if (booking.roomTypeId) {
            try {
              const roomTypeRes = await getRoomTypesDetailApi({ id: booking.roomTypeId })
              if (roomTypeRes?.data) {
                roomTypeName = roomTypeRes.data.roomType || ''
              }
            } catch (error) {
              console.error('获取房型详情失败', error)
            }
          }
          // 获取用户详情
          if (booking.userId) {
            try {
              const userRes = await getUsersDetailApi({ id: booking.userId })
              if (userRes?.data) {
                username = userRes.data.username || ''
              }
            } catch (error) {
              console.error('获取用户详情失败', error)
            }
          }
          return { ...booking, roomTypeName, username }
        })
      )
      bookingList.value = bookingsWithDetails
    }
  } catch (error) {
    console.error('获取预订单失败', error)
    ElMessage.error('获取预订单失败')
  }
}

onMounted(() => {
  fetchBookings(currentPage.value)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchBookings(page)
}

const handleConfirm = async (booking: IBookings.Row) => {
  try {
    if (booking.bookingId) {
      await confirmBookingsApi({ bookingId: booking.bookingId, roomId: 1, reason: '预订已确认' })
      booking.status = 'CONFIRMED'
      ElMessage.success('预订已确认')
    }
  } catch (error) {
    console.error('确认预订失败', error)
    ElMessage.error('确认预订失败')
  }
}

const statusText = (status: string): string => {
  switch(status) {
    case 'PENDING_CONFIRMATION':
      return '待确认'
    case 'CONFIRMED':
      return '已确认'
    case 'CANCELED':
      return '已取消'
    case 'FINISHED':
      return '已结束'
    default:
      return status
  }
}
</script>

<style scoped>
.reverse-ctrl {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7); /* 黑色透明背景 */
}

.reverse-ctrl__title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00; /* 黄色强调 */
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 覆盖 el-table 默认白色背景 */
.el-table {
  background-color: transparent !important;
}
.el-table th,
.el-table td {
  background-color: transparent !important;
}
</style>
