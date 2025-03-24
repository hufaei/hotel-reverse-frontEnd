<template>
    <div>
      <mi-register 
      :action="handleSubmit" 
      :title="title" 
      :background="bg1" 
      :username-tip="false" />
    </div>
  </template>
  
  <script setup lang="ts">

  import { useRouter } from 'vue-router';
  import { register } from '@/api/modules/system/user';
  import bg1 from '@/assets/background.png';
  import type { IUser } from '@/api/interface/system/user';
  
  const router = useRouter();
  const title="Botsuch Trip";
  // 提交处理函数
  const handleSubmit = async (data: IUser.Form) => {
    console.log(data);
    data.phone = "";
    const isSuccess = await register(data);
  
    if (isSuccess) {
      router.replace('/login'); 
    }
  };
  </script>