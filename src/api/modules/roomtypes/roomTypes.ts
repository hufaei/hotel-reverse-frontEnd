import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getRoomTypesListApi = (params: IRoomTypes.Query) => {
  return http.get<IPage<IRoomTypes.Row>>(ADMIN_MODULE + `/room-types`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createRoomTypesApi = (params: IRoomTypes.Form) => {
  return http.post(ADMIN_MODULE + `/room-types`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateRoomTypesApi = (params: IRoomTypes.Form) => {
  return http.put(ADMIN_MODULE + `/room-types`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeRoomTypesApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/room-types`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getRoomTypesDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IRoomTypes.Row>(ADMIN_MODULE + `/room-types/${id}`)
}

