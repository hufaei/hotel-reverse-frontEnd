<template>
  <mi-login :action="handleSubmit" :background=bg1 :captcha="false" :title="title"/>
  <!-- 显示错误信息 -->
  <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginApi } from '@/api/modules/system/login';
  import { useUserStore } from '@/stores/userStore';
  import {useAdminStore} from '@/stores/hotelAdminStore'
  import type { ILogin } from '@/api/interface/system/login';
  import bg1 from '@/assets/background.png'
  import {recommend} from '@/api/modules/hotels/hotels';

  const title="Botsuch Trip";
  const router = useRouter();
  const errorMessage = ref<string | null>(null);
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  /**
   * 提交登录逻辑
   */
  const handleSubmit = async (data: ILogin.LoginParams) => {
    try {
      console.log('Login params:', data);

      // 调用登录接口
      const response = await loginApi(data);

     
      // 如果是前台管理用户（用户名以 BOT 开头），跳转到 /admin
      if (!data.username.startsWith('BOT')) {
        // 设置 Token 和 用户信息
        userStore.setToken(response.data.accessToken);
        userStore.setUser(response.data.userInfo);
        // 普通用户登录后推荐并跳转到首页
        recommend();
        router.push('/');
      } else {
        adminStore.setToken(response.data.accessToken);
        adminStore.setUser(response.data.userInfo);
        router.push('/admins');
      }
    } catch (err: any) {
      // 登录失败，展示错误信息
      errorMessage.value = err?.response?.data?.message || '登录失败，请重试';
    }
  }


/**
 * 自定义登录逻辑事件处理.
 * 如下是 acion 为 string 类型的 url 接口地址时,
 * 默认请求接口时封装的 data 提交数据 ( 自定义时忽略此结构 ):
 * 
 * ```
 * 
 * ```
 */
  //  const data = {
  //      username: '',      // 账户
  //      password: '',                 // 登录密码
  //     //  captcha: true,                      // 是否开启验证码
  //     //  cuid: '',                           // 后端生成用于校验滑块验证码的唯一值
  //     //  remember: true                      // 记住登录状态
  //  }

</script>