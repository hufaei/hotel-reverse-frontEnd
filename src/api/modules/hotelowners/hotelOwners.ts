import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IHotelOwners } from '@/api/interface/hotelowners/hotelOwners'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getHotelOwnersListApi = (params: IHotelOwners.Query) => {
  return http.get<IPage<IHotelOwners.Row>>(ADMIN_MODULE + `/hotel-owners`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createHotelOwnersApi = (params: IHotelOwners.Form) => {
  return http.post(ADMIN_MODULE + `/hotel-owners`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateHotelOwnersApi = (params: IHotelOwners.Form) => {
  return http.put(ADMIN_MODULE + `/hotel-owners`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeHotelOwnersApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/hotel-owners`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getHotelOwnersDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IHotelOwners.Row>(ADMIN_MODULE + `/hotel-owners/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importHotelOwnersExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/hotel-owners/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportHotelOwnersExcelApi  = (params: IHotelOwners.Query) => {
  return http.download(ADMIN_MODULE + `/hotel-owners/export`, params)
}