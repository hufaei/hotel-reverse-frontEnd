import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

// 发送邮件
export const sendEmail = (Remail: string) => {
  return http.get(ADMIN_MODULE + `/users/sendEmail/${Remail}`);
};

// 验证邮箱
export const verifyEmail = (email: string) => {
  console.log(http.service);
  return http.get(ADMIN_MODULE + `/users/verifyEmail/${email}`);
};

// 验证码校验
export const verifyCode = (params: any) => {
  return http.post(ADMIN_MODULE + `/users/verifyCode`, params);
};





