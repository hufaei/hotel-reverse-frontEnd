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
import ProTable from '@/components/ProTable/index.vue'
import {
  createRoomTypeInventoryApi,
  removeRoomTypeInventoryApi,
  updateRoomTypeInventoryApi,
  getRoomTypeInventoryListApi,
  getRoomTypeInventoryDetailApi,
} from '@/api/modules/roomtypeinventory/roomTypeInventory';
import { useHandleData } from '@/hooks/index';
import RoomTypeInventoryForm from '@/views/roomtypeinventory/roomTypeInventory/components/RoomTypeInventoryForm.vue';
import type { IRoomTypeInventory } from '@/api/interface/roomtypeinventory/roomTypeInventory';
defineOptions({
  name: 'RoomTypeInventoryView'
})

// 获取table列表
const getTableList = (params: IRoomTypeInventory.Query) => {
  let newParams = formatParams(params);
  return getRoomTypeInventoryListApi(newParams);
};
const formatParams = (params: IRoomTypeInventory.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const roomTypeInventoryRef = ref<InstanceType<typeof RoomTypeInventoryForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getRoomTypeInventoryDetailApi({ id: row?.date })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IRoomTypeInventory.Row) => {
  await useHandleData(
    removeRoomTypeInventoryApi,
    { ids: [params.date] },
    `删除【${params.date}】房型预订存量`
  )
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeRoomTypeInventoryApi, { ids }, '删除所选房型预订存量')
}
</script>