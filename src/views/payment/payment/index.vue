<template>
  <div class="payment-wrapper">
    <!-- 1. 仅本地挂起订单提示 -->
    <div v-if="isLocalPendingOnly" class="pending-container">
      <el-alert
        title="您有一个未支付的订单"
        type="warning"
        description="请前往查看并完成支付"
        show-icon
      />
      <div class="timer-display">剩余支付时间：{{ timerText }}</div>
      <el-button type="primary" @click="goToPending">
        去支付
      </el-button>
    </div>

    <!-- 2. 其它场景：倒计时 + 支付表单 -->
    <div v-else>
      <el-card class="timer-card" shadow="hover">
        <div class="timer-text">剩余支付时间：{{ timerText }}</div>
      </el-card>

      <el-card class="payment-container" shadow="hover">
        <!-- 筛选区 -->
        <div class="filter-card">
          <div class="filter-inner">
            <div class="filter-item">
              <label class="filter-label">入住 & 退房</label>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                start-placeholder="入住日期"
                end-placeholder="退房日期"
                format="YYYY-MM-DD"
                :disabled="isLocked"
                :disabled-date="disablePastDate"
                style="width: 100%;"
              />
            </div>
            <div class="filter-item">
              <label class="filter-label">预订房间数量</label>
              <el-input-number
                v-model="guests"
                :min="1"
                :disabled="isLocked"
                style="width: 100%;"
              />
            </div>
            <div class="filter-item">
              <label class="filter-label">共住晚数</label>
              <el-input :model-value="nights" disabled style="width: 100%;" />
            </div>
          </div>
        </div>

        <!-- 酒店信息 -->
        <div class="hotel-info-card">
          <h3>{{ hotelDetail?.hotelName || '——' }}</h3>
          <p>{{ hotelDetail?.country }} {{ hotelDetail?.city }} {{ hotelDetail?.address }}</p>
          <el-rate
            v-if="hotelDetail"
            :model-value="hotelDetail.rate"
            disabled
            allow-half
            show-score
            score-template="{value}"
          />
        </div>

        <!-- 房型信息 -->
        <div class="room-info-card">
          <div class="room-header">
            <span class="room-label">房型：</span>
            <span class="room-text">{{ roomTypeDetail?.roomType || '——' }}</span>
            <span class="room-label" style="margin-left:40px;">价格：</span>
            <span class="room-text">￥{{ roomTypeDetail?.price ?? '—' }} / 晚</span>
          </div>
          <el-row :gutter="10" class="room-info-grid">
            <el-col v-for="(val, key) in parsedRoomInfo" :key="key" :span="6">
              <div class="info-item">
                <span class="info-label">{{ getInfoLabel(key) }}：</span>
                <span class="info-value">{{ val }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 订购者表单 & 支付 -->
        <div class="guest-form-card">
          <el-form :model="guestForm" label-width="90px">
            <el-form-item label="姓名">
              <el-input v-model="guestForm.name" :disabled="isLocked" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="guestForm.phone" :disabled="isLocked" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="guestForm.email" :disabled="isLocked" placeholder="选填邮箱" />
            </el-form-item>
            <el-form-item label="支付金额">
              <span class="total-price">￥{{ totalPrice }}</span>
            </el-form-item>
            <el-form-item class="submit-row">
              <el-button type="primary" size="large" @click="submitPayment">
                在线支付
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
  <PaymentForm v-model:visible="showPay" :bookingId="Number(bookingIdParam)" @paid-success="onPaidSuccess"/>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/useOrderStore';
import { getHotelsDetailApi } from '@/api/modules/hotels/hotels';
import { getRoomTypesDetailApi } from '@/api/modules/roomtypes/roomTypes';
import { createBookingsApi, getBookingsDetailApi } from '@/api/modules/bookings/bookings';
import type { IHotels } from '@/api/interface/hotels/hotels';
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes';
import type { IBookings } from '@/api/interface/bookings/bookings';
import PaymentForm from '@/views/payment/payment/components/PaymentForm.vue';
const showPay = ref(false);
const STORAGE_KEY = 'pendingOrder';
const TOTAL_SECONDS = 10 * 60;

// 解析房型 info
function parseRoomInfo(infoStr = ''): Record<string, string> {
  try { return JSON.parse(infoStr); } catch { return {}; }
}
const infoLabelMap: Record<string, string> = {
  floor: '楼层', checkin: '入住人数', wifi: 'WIFI', bed: '床型',
  area: '面积(㎡)', window: '窗户', smoke: '吸烟', breakfast: '早餐'
};
function getInfoLabel(key: string) { return infoLabelMap[key] || key; }

// 路由、Store
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// Query 参数
let bookingIdParam = route.query.bookingId as string || '';
const hotelId        = (route.query.hotelId    as string) || '';
const roomTypeId     = (route.query.roomTypeId as string) || '';
const userPhoneParam = (route.query.userPhone  as string) || '';
const bookCountParam = route.query.bookCount ? Number(route.query.bookCount) : undefined;

// UI 状态
const isLocalPendingOnly = ref(false);
const dateRange = ref<[Date,Date]>([new Date(), new Date()]);
const guests    = ref<number>(bookCountParam || 1);
const guestForm = reactive({ name:'', phone:userPhoneParam, email:'' });
const hotelDetail    = ref<IHotels.Row|null>(null);
const roomTypeDetail = ref<IRoomTypes.Row|null>(null);

// 解析房型、计算晚数、价格
const parsedRoomInfo = computed(() => parseRoomInfo(roomTypeDetail.value?.info));
const nights = computed(() => {
  const [s,e] = dateRange.value;
  return Math.max(1, (e.getTime()-s.getTime())/(1000*3600*24));
});
const totalPrice = computed(() => (roomTypeDetail.value?.price||0) * nights.value * guests.value);

// 倒计时
const remaining = ref(TOTAL_SECONDS);
let timerHandle: number|null = null;
const timerText = computed(() => {
  const m = String(Math.floor(remaining.value/60)).padStart(2,'0');
  const s = String(remaining.value%60).padStart(2,'0');
  return `${m}:${s}`;
});
function startTimer() {
  if (timerHandle!==null) return;
  timerHandle = window.setInterval(()=>{
    if(remaining.value>0) remaining.value--; else clearTimer();
  },1000);
}
function clearTimer() {
  if(timerHandle!==null){
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

// 是否锁定表单：已有 “bookingId” 场景
const isLocked = computed(() => !!bookingIdParam);

// 禁用过去日期
function disablePastDate(date: Date) {
  const t = new Date(); t.setHours(0,0,0,0);
  return date.getTime() < t.getTime();
}

// 三步初始化
async function initOrder() {
  // 1. 本地挂起优先
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const stored = JSON.parse(raw);
    const elapsed = (Date.now() - stored.timestamp)/1000;
    if (elapsed < TOTAL_SECONDS && !bookingIdParam) {
      isLocalPendingOnly.value = true;
      orderStore.saveOrder(stored);
      remaining.value = TOTAL_SECONDS - Math.floor(elapsed);
      startTimer();
      return;
    }
    // 已过期或后续场景，删掉
    localStorage.removeItem(STORAGE_KEY);
  }

  // 2. URL 带 bookingId —— 已有订单
  if (bookingIdParam) {
    // 本地同 ID 优先
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored.orderId === bookingIdParam) {
        orderStore.saveOrder(stored);
        const h = await getHotelsDetailApi({ id: stored.hotelId as string });
        hotelDetail.value = h.data;
        const r = await getRoomTypesDetailApi({ id: stored.roomTypeId as string });
        roomTypeDetail.value = r.data || null;
        applyOrderToUI(stored);
        return;
      }
    }
    // 否则调用 API（不改动 guests）
    const res = await getBookingsDetailApi({ id: Number(bookingIdParam) });
    const d = res.data as IBookings.Row;
    const obj = {
      orderId: bookingIdParam as string,
      hotelId: d.hotelId as string,
      roomTypeId: d.roomTypeId as string,
      startDate: d.bookingDate as string,
      endDate: d.bookingEnd as string,
      userPhone: d.userPhone as string,
      bookCount: guests.value,
      timestamp: Date.now()
    };
    orderStore.saveOrder(obj);
    const h = await getHotelsDetailApi({ id: d.hotelId as string });
    hotelDetail.value = h.data;
    const r = await getRoomTypesDetailApi({ id: d.roomTypeId as string });
    roomTypeDetail.value = r.data || null;
    applyOrderToUI(obj);
    return;
  }

  // 3. 新建订单
  const sd = dateRange.value[0].toISOString().slice(0,10);
  const ed = dateRange.value[1].toISOString().slice(0,10);
  const res = await createBookingsApi({
    hotelId, roomTypeId,
    bookingDate: sd, bookingEnd: ed,
    userPhone: guestForm.phone,
    bookCount: guests.value
  });
  if (res.data) {
    bookingIdParam = String(res.data);
    const obj = {
      orderId: String(res.data),
      hotelId, roomTypeId,
      startDate: sd, endDate: ed,
      userPhone: guestForm.phone,
      bookCount: guests.value,
      timestamp: Date.now()
    };
    orderStore.saveOrder(obj);
    applyOrderToUI(obj);
  }
}

// 回填 UI 并启动倒计时
function applyOrderToUI(o: any) {
  dateRange.value = [new Date(o.startDate), new Date(o.endDate)];
  guests.value    = o.bookCount;
  guestForm.phone = o.userPhone;
  const elapsed   = Math.floor((Date.now() - o.timestamp)/1000);
  remaining.value = Math.max(0, TOTAL_SECONDS - elapsed);
  startTimer();
}

// 跳转到带 bookingId 的当前页
function goToPending() {
  const p = orderStore.pendingOrder!;
  router.replace({
    path: '/payments',
    query: { bookingId: p.orderId }
  });
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// 提交支付
function submitPayment() {
  console.log('支付订单', orderStore.pendingOrder, '客户信息', guestForm, '金额', totalPrice.value);
  // TODO: 接入支付 SDK，成功后：
  showPay.value = true
}
function onPaidSuccess() {
  // 支付完成后刷新列表、跳转页面等
  console.log('支付成功');
  orderStore.clearOrder();
  clearTimer();
  router.push('/user/orders');
}
onMounted(async ()=>{
  // 回填 URL 里的初始筛选
  if (route.query.startDate && route.query.endDate) {
    dateRange.value = [
      new Date(route.query.startDate as string),
      new Date(route.query.endDate   as string)
    ];
  }
  if (bookCountParam) guests.value = bookCountParam;

  // 取酒店 + 房型详情
  if (hotelId) {
    const h = await getHotelsDetailApi({ id: hotelId });
    hotelDetail.value = h.data;
    const r = await getRoomTypesDetailApi({ id: roomTypeId});
    roomTypeDetail.value = r.data || null;
  }

  // 执行三步初始化
  await initOrder();
});

onBeforeUnmount(clearTimer);
</script>

<style scoped>
.payment-wrapper { width: 80%; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.pending-container { text-align: center; padding: 40px; }
.timer-display { margin: 12px 0; font-size: 18px; color: #d46b08; font-weight: 600; }
.timer-card { background: #fff7e6; border-color: #ffe58f; text-align: center; }
.timer-text { font-size: 18px; font-weight: 600; color: #d46b08; padding: 10px 0; }
.payment-container { display: flex; flex-direction: column; gap: 20px; }
.filter-card { padding: 15px; }
.filter-inner { display: flex; gap: 20px; }
.filter-item { flex: 1; display: flex; flex-direction: column; }
.filter-label { font-weight: 600; margin-bottom: 6px; }
.hotel-info-card, .room-info-card, .guest-form-card { padding: 20px; }
.room-header { display: flex; align-items: center; margin-bottom: 10px; }
.room-label { font-size: 16px; font-weight: 600; }
.room-text  { font-size: 16px; margin-right: 20px; }
.room-info-grid { margin-top: 10px; }
.info-item { margin-bottom: 8px; }
.info-label { font-weight: 500; }
.total-price { font-size: 20px; font-weight: 700; color: #f56c6c; }
.submit-row { text-align: center; }
.submit-row .el-button { width: 200px; }
</style>
