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
  Upload,
  Download,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createRoomsApi,
  removeRoomsApi,
  updateRoomsApi,
  getRoomsListApi,
  getRoomsDetailApi,
  importRoomsExcelApi,
  exportRoomsExcelApi,
} from '@/api/modules/rooms/rooms';
import { useHandleData } from '@/hooks/index';
import RoomsForm from '@/views/rooms/rooms/components/RoomsForm.vue';
import type { IRooms } from '@/api/interface/rooms/rooms';
defineOptions({
  name: 'RoomsView'
})
// 列表配置项
const definitions: IRooms.Row[] = [];

// 获取table列表
const getTableList = (params: IRooms.Query) => {
  let newParams = formatParams(params);
  return getRoomsListApi(newParams);
};
const formatParams = (params: IRooms.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const roomsRef = ref<InstanceType<typeof RoomsForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getRoomsDetailApi({ id: row?.roomId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IRooms.Row) => {
  await useHandleData(
    removeRoomsApi,
    { ids: [params.roomId] },
    `删除【${params.roomId}】房间信息表`
  )
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeRoomsApi, { ids }, '删除所选房间信息表')
}

</script>