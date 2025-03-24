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
import {
  createHotelsApi,
  removeHotelsApi,
  updateHotelsApi,
  getHotelsListApi,
  getHotelsDetailApi,
  importHotelsExcelApi,
  exportHotelsExcelApi,
} from '@/api/modules/hotels/hotels';
import { useHandleData } from '@/hooks/index';
import HotelsForm from '@/views/hotels/hotels/components/HotelsForm.vue';
import type { IHotels } from '@/api/interface/hotels/hotels';
defineOptions({
  name: 'HotelsView'
})
// 获取table列表
const getTableList = (params: IHotels.Query) => {
  let newParams = formatParams(params);
  return getHotelsListApi(newParams);
};
const formatParams = (params: IHotels.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const hotelsRef = ref<InstanceType<typeof HotelsForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getHotelsDetailApi({ id: row?.hotelId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IHotels.Row) => {
  await useHandleData(
    removeHotelsApi,
    { ids: [params.hotelId] },
    `删除【${params.hotelId}】酒店信息表`
  )
}
</script>