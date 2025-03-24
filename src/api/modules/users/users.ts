import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IUsers } from '@/api/interface/users/users'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getUsersListApi = (params: IUsers.Query) => {
  return http.get<IPage<IUsers.Row>>(ADMIN_MODULE + `/users`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createUsersApi = (params: IUsers.Form) => {
  return http.post(ADMIN_MODULE + `/users`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateUsersApi = (params: IUsers.Form) => {
  return http.put(ADMIN_MODULE + `/users`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeUsersApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/users`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getUsersDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IUsers.Row>(ADMIN_MODULE + `/users/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importUsersExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/users/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportUsersExcelApi  = (params: IUsers.Query) => {
  return http.download(ADMIN_MODULE + `/users/export`, params)
}