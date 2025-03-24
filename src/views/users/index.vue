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
  createUsersApi,
  removeUsersApi,
  updateUsersApi,
  getUsersListApi,
  getUsersDetailApi,
  importUsersExcelApi,
  exportUsersExcelApi,
} from '@/api/modules/users/users';
import { useHandleData } from '@/hooks/index';
import UsersForm from '@/views/users/users/components/UsersForm.vue';
import type { IUsers } from '@/api/interface/users/users';

defineOptions({
  name: 'UsersView'
})

// 获取table列表
const getTableList = (params: IUsers.Query) => {
  let newParams = formatParams(params);
  return getUsersListApi(newParams);
};
const formatParams = (params: IUsers.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const usersRef = ref<InstanceType<typeof UsersForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getUsersDetailApi({ id: row?.userId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IUsers.Row) => {
  await useHandleData(
    removeUsersApi,
    { ids: [params.userId] },
    `删除【${params.userId}】用户信息表`
  )
}

</script>