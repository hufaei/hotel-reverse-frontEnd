import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IRoomTypeInventory } from '@/api/interface/roomtypeinventory/roomTypeInventory'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getRoomTypeInventoryListApi = (params: IRoomTypeInventory.Query) => {
  return http.get<IPage<IRoomTypeInventory.Row>>(ADMIN_MODULE + `/room-type-inventory`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createRoomTypeInventoryApi = (params: IRoomTypeInventory.Form) => {
  return http.post(ADMIN_MODULE + `/room-type-inventory`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateRoomTypeInventoryApi = (params: IRoomTypeInventory.Form) => {
  return http.put(ADMIN_MODULE + `/room-type-inventory`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeRoomTypeInventoryApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/room-type-inventory`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getRoomTypeInventoryDetailApi = (params: { id: string }) => {
  const { id } = params
  return http.get<IRoomTypeInventory.Row>(ADMIN_MODULE + `/room-type-inventory/${id}`)
}

