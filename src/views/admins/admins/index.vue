<template>
  <mi-layout >
    <template #sider>
        <mi-layout-sider>
          <mi-layout-sider-logo />
          <template #menu>
            <AdminSider/>
          </template>
        </mi-layout-sider>
    </template>
    <template #header>
      <mi-layout-header>
        <!-- <div class="left">
            <mi-breadcrumb />
        </div> -->
        <div class="right">
            <mi-search />
            <mi-palette />
            <mi-dropdown />
        </div>
      </mi-layout-header>
    </template>
    <template #content>
      <router-view />
    </template>
    <template #footer>
      <!-- 暂定页尾写什么还不知道 -->
      <mi-layout-footer>
      </mi-layout-footer>
    </template>
  </mi-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {getAdminsListApi,getAdminsDetailApi,} from '@/api/modules/admins/admins';
import { useHandleData } from '@/hooks/index';
import AdminSider from '@/views/admins/admins/components/AdminSider.vue';
import type { IAdmins } from '@/api/interface/admins/admins';
defineOptions({
  name: 'AdminsView'
})
const isShowBread = ref(false);
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
<style scoped>
:global(#app) {
  background: none !important;
}
</style>