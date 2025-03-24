import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IUser } from '@/api/interface/system/user';
import type { IPage } from '@/api/interface';
import type { ISysDept } from '@/api/interface/system/dept';

/**
 * 获取用户列表
 * @param params
 * @returns {*}
 */
export const getUserList = (params: IUser.Query) => {
  return http.get<IPage<IUser.Info>>(ADMIN_MODULE + `/sys-user`, params, { loading: false });
};

/**
 * 添加用户
 * @param params
 * @returns {*}
 */
export const register = (params: IUser.Form) => {
  return http.post(ADMIN_MODULE + `/users`, params);
};

/**
 * 修改用户
 * @param params
 * @returns {*}
 */
export const editUser = (params: IUser.Form) => {
  return http.put(ADMIN_MODULE + `/users`, params);
};

/**
 * 删除用户
 * @param params
 * @returns {*}
 */
export const deleteUser = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/users`, params);
};

/**
 * 获取用户角色
 * @param params
 * @returns {*}
 */
export const getUserRole = (params: { userId: number }) => {
  return http.get<IUser.RoleData>(ADMIN_MODULE + `/sys-user/role`, params);
};

/**
 * 设置用户角色
 * @param params
 * @returns {*}
 */
export const setUserRole = (params: IUser.RoleForm) => {
  return http.put(ADMIN_MODULE + `/sys-user/role`, params);
};


/**
 * 获取登录用户信息
 * @returns {*}
 */
export const getUserinfo = () => {
  return http.get<IUser.Info>(ADMIN_MODULE + `/sys-user/userinfo`);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const bindUserDeptApi = (params: ISysDept.DeptSetting) => {
  return http.post(ADMIN_MODULE + `/sys-user/dept/bind`, params);
};

/**
 * 用户部门属性列表
 */
export const getUserDeptTree = () => {
  return http.get<ISysDept.Tree[]>(ADMIN_MODULE + `/sys-user/dept/tree`);
};

/**
 * 解锁用户
 * @param params
 * @returns {*}
 */
export const unlockUser = (params: { ids: (string | number)[] }) => {
  return http.post(ADMIN_MODULE + `/sys-user/unlock`, params);
};

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getUserDetailApi = (params: { id: string }) => {
  const { id } = params;
  return http.get<IUser.Info>(ADMIN_MODULE + `/sys-user/${id}`);
};

// 重置密码
export const resetPassword = (params:IUser.PasswordForm) => {
  return http.post(ADMIN_MODULE + `/auth/resetPassword`, params);
};