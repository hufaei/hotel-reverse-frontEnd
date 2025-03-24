<template>
  <div></div>
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
  createAdminsApi,
  removeAdminsApi,
  updateAdminsApi,
  getAdminsListApi,
  getAdminsDetailApi,
} from '@/api/modules/admins/admins';
import { useHandleData } from '@/hooks/index';
import AdminsForm from '@/views/admins/admins/components/AdminsForm.vue';
import type { IAdmins } from '@/api/interface/admins/admins';
defineOptions({
  name: 'AdminsView'
})

const getTableList = (params: IAdmins.Query) => {
  let newParams = formatParams(params);
  return getAdminsListApi(newParams);
};
const formatParams = (params: IAdmins.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const adminsRef = ref<InstanceType<typeof AdminsForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getAdminsDetailApi({ id: row?.adminId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IAdmins.Row) => {
  // await useHandleData(
  //   removeAdminsApi,
  //   { ids: [params.adminId] },
  //   `删除【${params.adminId}】管理员信息表`
  // )
}
</script>