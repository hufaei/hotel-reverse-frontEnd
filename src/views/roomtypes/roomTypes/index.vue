<template>
  <div class="table-box">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
} from '@element-plus/icons-vue'
import {
  createRoomTypesApi,
  removeRoomTypesApi,
  updateRoomTypesApi,
  getRoomTypesListApi,
  getRoomTypesDetailApi,
} from '@/api/modules/roomtypes/roomTypes';
import { useHandleData } from '@/hooks/index';
import RoomTypesForm from '@/views/roomtypes/roomTypes/components/RoomTypesForm.vue';
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes';
defineOptions({
  name: 'RoomTypesView'
})
// 获取table列表
const getTableList = (params: IRoomTypes.Query) => {
  let newParams = formatParams(params);
  return getRoomTypesListApi(newParams);
};
const formatParams = (params: IRoomTypes.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const roomTypesRef = ref<InstanceType<typeof RoomTypesForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getRoomTypesDetailApi({ id: row?.roomTypeId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IRoomTypes.Row) => {
  await useHandleData(
    removeRoomTypesApi,
    { ids: [params.roomTypeId] },
    `删除【${params.roomTypeId}】房型表`
  )
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeRoomTypesApi, { ids }, '删除所选房型表')
}
</script>