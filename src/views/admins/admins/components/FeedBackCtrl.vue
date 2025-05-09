<template>
  <div class="rooms-ctrl">
    <div class="room-types">
      <el-card
        v-for="roomType in roomTypes"
        :key="roomType.roomTypeId"
        class="room-type-card"
        shadow="hover"
      >
        <!-- Card Header：房型图片、名称、价格和修改价格按钮 -->
        <div class="room-type-header">
          <img
            class="room-type-img"
            :src="roomType.photoUrls || defaultRoomTypeImg"
            alt="房型图片"
          />
          <div class="room-type-info">
            <h4>{{ roomType.roomType }}</h4>
            <div class="type-price">
              <span>价格：￥{{ roomType.price }}</span>
              <el-button size="small" type="info" @click="open(roomType)">修改价格</el-button>
            </div>
          </div>
        </div>
        <!-- Card 内容：两个房间一行 -->
        <div class="rooms-grid">
          <div
            class="room-item"
            v-for="room in roomType.rooms"
            :key="room.roomId"
          >
            <div class="room-main">
              <span class="room-number">房间：{{ room.roomNumber }}</span>
              <span class="room-status">状态：{{ roomStatusText(room.roomStatus) }}</span>
            </div>
            <div class="room-ops">
              <el-button
                v-if="room.roomStatus !== 'READY'"
                type="primary"
                @click="updateRoomStatus(room, 'toReady')"
              >空闲</el-button>
              <el-button
                v-if="room.roomStatus !== 'CHECK_IN'"
                type="success"
                @click="updateRoomStatus(room, 'toCheckIn')"
              >入住</el-button>
              <el-button
                v-if="room.roomStatus !== 'CLEANING'"
                type="warning"
                @click="updateRoomStatus(room, 'toCleaning')"
              >打扫</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 修改房型价格弹窗 -->
    <el-dialog
      title="修改房型价格"
      v-model="editTypePriceDialogVisible"
      width="30%"
    >
      <el-input v-model.number="newTypePrice" placeholder="请输入新价格" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTypePriceDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTypePriceChange()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoomTypesListApi ,updateRoomTypesApi} from '@/api/modules/roomtypes/roomTypes'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'
import { getRoomsListApi, toReady, toCheckIn, toCleaning } from '@/api/modules/rooms/rooms'
import type { IRooms } from '@/api/interface/rooms/rooms'
import { useAdminStore } from '@/stores/hotelAdminStore'

// 默认房型图片
const defaultRoomTypeImg = 'https://via.placeholder.com/150'
// 管理员店铺信息
const adminStore = useAdminStore()
const ownerHotelId = adminStore.user.ownerHotelId

// 房型数据，扩展增加price字段和rooms数组
const roomTypes = ref<Array<IRoomTypes.Row & { price: number; rooms: IRooms.Row[] }>>([])

// 查询房型及对应房间数据
onMounted(async () => {
  try {
    // 1. 获取房型列表
    const typeRes = await getRoomTypesListApi({ hotelId: ownerHotelId, limit: 10, page: 1 })
    if (typeRes?.data) {
      const types: IRoomTypes.Row[] = typeRes.data.rows || []
      // 2. 对每个房型查询房间列表
      const enriched = await Promise.all(
        types.map(async rt => {
          // 默认价格取接口返回或随机
          const price = rt.price || Math.floor(Math.random() * 400) + 100
          // 调用获取房间列表接口
          const roomRes = await getRoomsListApi({ hotelId: ownerHotelId, roomType: rt.roomType! ,limit:10,page:1})
          const rooms: IRooms.Row[] = roomRes?.data?.rows || []
          return {
            ...rt,
            price,
            rooms,
          }
        })
      )
      roomTypes.value = enriched
    }
  } catch (error) {
    console.error('查询房型或房间失败：', error)
    ElMessage.error('查询房型或房间失败')
  }
})

// 更新房间状态（调用对应接口，并更新本地数据）
const updateRoomStatus = async (
  room: IRooms.Row,
  action: 'toReady' | 'toCheckIn' | 'toCleaning'
) => {
  try {
    const params: IRooms.IdUpdate = { roomId: room.roomId! }
    if (action === 'toReady') {
      await toReady(params)
      room.roomStatus = 'READY'
    } else if (action === 'toCheckIn') {
      await toCheckIn(params)
      room.roomStatus = 'CHECK_IN'
    } else if (action === 'toCleaning') {
      await toCleaning(params)
      room.roomStatus = 'CLEANING'
    }
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('操作失败：', error)
    ElMessage.error('操作失败')
  }
}

// 格式化房间状态文本
const roomStatusText = (status: string | undefined): string => {
  switch (status) {
    case 'READY':
      return '空闲'
    case 'CHECK_IN':
      return '入住'
    case 'CLEANING':
      return '打扫中'
    default:
      return status || ''
  }
}

// 修改房型价格相关
const editTypePriceDialogVisible = ref(false)
const currentRoomType = ref<IRoomTypes.Row & { price: number } | null>(null)
const newTypePrice = ref<number>(0)

const open = async (roomType: IRoomTypes.Row & { price: number }) => {
  currentRoomType.value = roomType
  try {
    const { value } = await ElMessageBox.prompt('请输入新价格', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputPattern: /^\d+(\.\d{1,2})?$/,
      inputErrorMessage: 'Invalid Price',
    })
    if (value) {
      newTypePrice.value = parseFloat(value)
      editTypePriceDialogVisible.value = true
    }
  } catch (error) {
    ElMessage({ type: 'info', message: 'Input canceled' })
  }
}

const submitTypePriceChange = async () => {
  console.log("修改价格")
  if (currentRoomType.value) {
    try {
      // 调用更新房型价格接口
      await updateRoomTypesApi({ roomTypeId: currentRoomType.value.roomTypeId!, price: newTypePrice.value })
      currentRoomType.value.price = newTypePrice.value
      ElMessage.success('房型价格更新成功')
    } catch (error) {
      console.error('更新价格失败：', error)
      ElMessage.error('更新价格失败')
    }
  }
  editTypePriceDialogVisible.value = false
}
</script>

<style scoped>
/* 原样保留样式，无变化 */
.rooms-ctrl { padding: 20px; background-color: #1a1a1a; color: #ccc; }
.rooms-ctrl__title { margin-bottom: 20px; text-align: center; }
.rooms-ctrl__title h3 { font-size: 28px; margin: 0; color: #ffcc00; }
.room-types { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
.room-type-card { width: 90%; max-width: 800px; background-color: rgba(0, 0, 0, 0.7); color: #ccc; padding: 15px; border-radius: 8px; }
.room-type-header { display: flex; align-items: center; border-bottom: 1px solid rgba(255, 204, 0, 0.4); padding-bottom: 10px; margin-bottom: 10px; }
.room-type-img { width: 200px; height: 160px; object-fit: cover; border-radius: 4px; }
.room-type-info { margin-left: 15px; flex: 1; }
.room-type-info h4 { margin: 0; font-size: 24px; color: #ffcc00; }
.type-price { margin-top: 8px; display: flex; align-items: center; gap: 10px; font-size: 18px; color: #fff; }
.rooms-grid { display: flex; flex-wrap: wrap; gap: 15px; }
.room-item { width: calc(50% - 15px); background-color: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; }
.room-main { margin-bottom: 8px; }
.room-number { font-size: 16px; font-weight: bold; color: #ffcc00; }
.room-status { font-size: 14px; color: #aaa; }
.room-ops { display: flex; gap: 5px; flex-wrap: wrap; }
.el-button { font-size: 12px; }
</style>
