<template>
  <div>
    <BookingsForm />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
  Upload,
  Download,
} from '@element-plus/icons-vue'
import {
  createBookingsApi,
  removeBookingsApi,
  updateBookingsApi,
  getBookingsListApi,
  getBookingsDetailApi,
  importBookingsExcelApi,
  exportBookingsExcelApi,
} from '@/api/modules/bookings/bookings';
import { useHandleData } from '@/hooks/index';
import BookingsForm from '@/views/bookings/bookings/components/BookingsForm.vue';
import type { IBookings } from '@/api/interface/bookings/bookings';
defineOptions({
  name: 'BookingsView'
})

// 获取table列表
const getTableList = (params: IBookings.Query) => {
  let newParams = formatParams(params);
  return getBookingsListApi(newParams);
};
const formatParams = (params: IBookings.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.bookingDate && (newParams.bookingDateStart = newParams.bookingDate[0]);
  newParams.bookingDate && (newParams.bookingDateEnd = newParams.bookingDate[1]);
  delete newParams.bookingDate;
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
</script>