import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IRooms } from '@/api/interface/rooms/rooms'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getRoomsListApi = (params: IRooms.Query) => {
  return http.get<IPage<IRooms.Row>>(ADMIN_MODULE + `/rooms`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createRoomsApi = (params: IRooms.Form) => {
  return http.post(ADMIN_MODULE + `/rooms`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateRoomsApi = (params: IRooms.Form) => {
  return http.put(ADMIN_MODULE + `/rooms`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeRoomsApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/rooms`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getRoomsDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IRooms.Row>(ADMIN_MODULE + `/rooms/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importRoomsExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/rooms/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportRoomsExcelApi  = (params: IRooms.Query) => {
  return http.download(ADMIN_MODULE + `/rooms/export`, params)
}
/**
 * 状态->空闲
 */
export const toReady = (params: IRooms.IdUpdate) =>{
  return http.put(ADMIN_MODULE + `/rooms/toReady`, params)
}
/**
 * 状态->入住
 */
export const toCheckIn = (params: IRooms.IdUpdate) =>{
  return http.put(ADMIN_MODULE + `/rooms/toCheckIn`, params)
}
/**
 * 状态->打扫中
 */
export const toCleaning = (params: IRooms.IdUpdate) =>{
  return http.put(ADMIN_MODULE + `/rooms/toCleaning`, params)
}