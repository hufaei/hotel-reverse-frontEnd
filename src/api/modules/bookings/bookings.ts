import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IBookings } from '@/api/interface/bookings/bookings'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getBookingsListApi = (params: IBookings.Query) => {
  return http.get<IPage<IBookings.Row>>(ADMIN_MODULE + `/bookings`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createBookingsApi = (params: IBookings.Form) => {
  return http.post(ADMIN_MODULE + `/bookings`, params)
}

/**
 * 取消订单（用户、酒店）
 * @param params 
 * @returns 
 */
export const cancelBookingsApi = (params: {bookingId: number, reason: string}) => {
  return http.post(ADMIN_MODULE + `/bookings/cancel`, params)
}
/**
 * 确认--酒店
 * @param params 
 * @returns 
 */
export const confirmBookingsApi = (params: {bookingId: number, roomId:number,reason: string}) => {
  return http.put(ADMIN_MODULE + `/bookings/confirm`, params)
}
/**
 * 取消订单（用户、酒店）
 * @param params 
 * @returns 
 */
export const finishBookingsApi = (params: {bookingId: number,roomId:number, reason: string}) => {
  return http.post(ADMIN_MODULE + `/bookings/finish`, params)
}
/**
* 修改
* @param params
* @returns {*}
*/
export const updateBookingsApi = (params: IBookings.Form) => {
  return http.put(ADMIN_MODULE + `/bookings`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeBookingsApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/bookings`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getBookingsDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IBookings.Row>(ADMIN_MODULE + `/bookings/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importBookingsExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/bookings/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportBookingsExcelApi  = (params: IBookings.Query) => {
  return http.download(ADMIN_MODULE + `/bookings/export`, params)
}