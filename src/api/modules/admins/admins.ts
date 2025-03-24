import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IAdmins } from '@/api/interface/admins/admins'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getAdminsListApi = (params: IAdmins.Query) => {
  return http.get<IPage<IAdmins.Row>>(ADMIN_MODULE + `/admins`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createAdminsApi = (params: IAdmins.Form) => {
  return http.post(ADMIN_MODULE + `/admins`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateAdminsApi = (params: IAdmins.Form) => {
  return http.put(ADMIN_MODULE + `/admins`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeAdminsApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/admins`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getAdminsDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IAdmins.Row>(ADMIN_MODULE + `/admins/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importAdminsExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/admins/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportAdminsExcelApi  = (params: IAdmins.Query) => {
  return http.download(ADMIN_MODULE + `/admins/export`, params)
}