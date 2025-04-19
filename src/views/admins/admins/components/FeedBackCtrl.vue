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
              <el-button size="mini" type="info" @click="open(roomType)">修改价格</el-button>
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
              <span class="room-status">状态：{{ roomStatusText(room.status) }}</span>
            </div>
            <div class="room-ops">
              <el-button
                v-if="room.status !== 'READY'"
                size="mini"
                type="primary"
                @click="updateRoomStatus(room, 'toReady')"
              >空闲</el-button>
              <el-button
                v-if="room.status !== 'CHECK_IN'"
                size="mini"
                type="success"
                @click="updateRoomStatus(room, 'toCheckIn')"
              >入住</el-button>
              <el-button
                v-if="room.status !== 'CLEANING'"
                size="mini"
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
      v-model:visible="editTypePriceDialogVisible"
      width="30%"
    >
      <el-input v-model.number="newTypePrice" placeholder="请输入新价格" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTypePriceDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTypePriceChange">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox} from 'element-plus'
import { getRoomTypesListApi } from '@/api/modules/roomtypes/roomTypes'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'
import { toReady, toCheckIn, toCleaning, updateRoomsApi } from '@/api/modules/rooms/rooms'
import type { IRooms } from '@/api/interface/rooms/rooms'


// 当前酒店ID
const hotelId = "JD0000001970"
// 默认房型图片
const defaultRoomTypeImg = 'https://via.placeholder.com/150'

// 房型数据，扩展增加price字段和rooms数组
const roomTypes = ref<Array<IRoomTypes.Row & { price: number, rooms: RoomItemClass[] }>>([])

// 定义房间数据结构
interface RoomItem {
  roomId: number
  roomNumber: string
  status: 'READY' | 'CHECK_IN' | 'CLEANING'
  price: number
}

// 用 class 实现房间对象
class RoomItemClass implements RoomItem {
  roomId: number
  roomNumber: string
  status: 'READY' | 'CHECK_IN' | 'CLEANING'
  price: number

  constructor(roomId: number, roomNumber: string, status: 'READY' | 'CHECK_IN' | 'CLEANING', price: number) {
    this.roomId = roomId
    this.roomNumber = roomNumber
    this.status = status
    this.price = price
  }
}

// 模拟生成房间数据，每个房型生成 4 个房间（2列）
const generateRoomData = (roomTypeId: string): RoomItemClass[] => {
  return [1, 2, 3, 4].map(num => {
    const price = Math.floor(Math.random() * 400) + 100
    return new RoomItemClass(Number(roomTypeId + num), `${roomTypeId.slice(-3)}-${num}`, 'READY', price)
  })
}

// 查询房型及生成模拟房间数据
onMounted(async () => {
  try {
    const res = await getRoomTypesListApi({ hotelId, limit: 10, page: 1 })
    if (res?.data) {
      const types: IRoomTypes.Row[] = res.data.rows || []
      // 假设每个房型增加一个price字段（若接口没有，可自行赋值）
      roomTypes.value = types.map(rt => ({
        ...rt,
        price: rt.price || (Math.floor(Math.random() * 400) + 100),
        rooms: rt.roomTypeId ? generateRoomData(rt.roomTypeId) : []
      }))
    }
  } catch (error) {
    console.error('查询房型失败：', error)
    ElMessage.error('查询房型失败')
  }
})

// 更新房间状态（调用对应接口，并更新本地数据）
const updateRoomStatus = async (
  room: RoomItemClass,
  action: 'toReady' | 'toCheckIn' | 'toCleaning'
) => {
  try {
    const params: IRooms.IdUpdate = { roomId: room.roomId }
    if (action === 'toReady') {
      await toReady(params)
      room.status = 'READY'
    } else if (action === 'toCheckIn') {
      await toCheckIn(params)
      room.status = 'CHECK_IN'
    } else if (action === 'toCleaning') {
      await toCleaning(params)
      room.status = 'CLEANING'
    }
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('操作失败：', error)
    ElMessage.error('操作失败')
  }
}

// 格式化房间状态文本
const roomStatusText = (status: string): string => {
  switch (status) {
    case 'READY': return '空闲'
    case 'CHECK_IN': return '入住'
    case 'CLEANING': return '打扫中'
    default: return status
  }
}

// 修改房型价格相关
const editTypePriceDialogVisible = ref(false)
const currentRoomType = ref<IRoomTypes.Row & { price: number } | null>(null)
const newTypePrice = ref<number>(0)

const open = async (roomType: IRoomTypes.Row & { price: number }) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新价格', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputPattern: /^\d+(\.\d{1,2})?$/,
      inputErrorMessage: 'Invalid Price',
    })
    if (value) {
      // 调用接口更新价格
      
    }
  } catch (error) {
    ElMessage({
      type: 'info',
      message: 'Input canceled',
    })
  }
}

const submitTypePriceChange = () => {
  if (currentRoomType.value) {
    currentRoomType.value.price = newTypePrice.value
    ElMessage.success('房型价格更新成功')
  }
  editTypePriceDialogVisible.value = false
}
</script>

<style scoped>
.rooms-ctrl {
  padding: 20px;
  background-color: #1a1a1a; /* 深色背景 */
  color: #ccc; /* 灰色字体 */
}

.rooms-ctrl__title {
  margin-bottom: 20px;
  text-align: center;
}

.rooms-ctrl__title h3 {
  font-size: 28px;
  margin: 0;
  color: #ffcc00; /* 黄色强调 */
}

/* 房型卡片 */
.room-types {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.room-type-card {
  width: 90%;
  max-width: 800px;
  background-color: rgba(0, 0, 0, 0.7); /* 深色半透明 */
  color: #ccc;
  padding: 15px;
  border-radius: 8px;
}

.room-type-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 204, 0, 0.4);
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.room-type-img {
  width: 200px;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
}

.room-type-info {
  margin-left: 15px;
  flex: 1;
}

.room-type-info h4 {
  margin: 0;
  font-size: 24px;
  color: #ffcc00;
}

.type-price {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: #fff;
}

/* 房间网格：两列布局 */
.rooms-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.room-item {
  width: calc(50% - 15px);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-main {
  margin-bottom: 8px;
}

.room-number {
  font-size: 16px;
  font-weight: bold;
  color: #ffcc00;
}

.room-status {
  font-size: 14px;
  color: #aaa;
}

.room-ops {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.el-button {
  font-size: 12px;
}
</style>
