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
  createHotelOwnersApi,
  removeHotelOwnersApi,
  updateHotelOwnersApi,
  getHotelOwnersListApi,
  getHotelOwnersDetailApi,
  importHotelOwnersExcelApi,
  exportHotelOwnersExcelApi,
} from '@/api/modules/hotelowners/hotelOwners';
import { useHandleData } from '@/hooks/index';
import HotelOwnersForm from '@/views/hotelowners/hotelOwners/components/HotelOwnersForm.vue';
import type { IHotelOwners } from '@/api/interface/hotelowners/hotelOwners';
import ImportExcel from '@/components/ImportExcel/index.vue';
defineOptions({
  name: 'HotelOwnersView'
})

// 获取table列表
const getTableList = (params: IHotelOwners.Query) => {
  let newParams = formatParams(params);
  return getHotelOwnersListApi(newParams);
};
const formatParams = (params: IHotelOwners.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getHotelOwnersDetailApi({ id: row?.ownerId })
    row = record?.data
  }

}
// 删除信息
const deleteInfo = async (params: IHotelOwners.Row) => {
  await useHandleData(
    removeHotelOwnersApi,
    { ids: [params.ownerId] },
    `删除【${params.ownerId}】酒店入驻代表人表`
  )
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeHotelOwnersApi, { ids }, '删除所选酒店入驻代表人表')
}
</script>