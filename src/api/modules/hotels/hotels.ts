import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IHotels } from '@/api/interface/hotels/hotels'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getHotelsListApi = (params: IHotels.Query) => {
  return http.get<IPage<IHotels.Row>>(ADMIN_MODULE + `/hotels`, params)
}
/**
 * 推荐
 * @param params 
 * @returns 
 */
export const getRecommendList = () => {
  return http.get<IPage<String>>(ADMIN_MODULE + `/hotels/getRecommend`)
}
export const recommend = async() => {
  return http.post(ADMIN_MODULE + `/hotels/recommend`)
}
/**
* 添加
* @param params
* @returns {*}
*/
export const createHotelsApi = (params: IHotels.Form) => {
  return http.post(ADMIN_MODULE + `/hotels`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateHotelsApi = (params: IHotels.Form) => {
  return http.put(ADMIN_MODULE + `/hotels`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeHotelsApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/hotels`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getHotelsDetailApi = (params: { id: string }) => {
  const { id } = params
  return http.get<IHotels.Row>(ADMIN_MODULE + `/hotels/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importHotelsExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/hotels/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportHotelsExcelApi  = (params: IHotels.Query) => {
  return http.download(ADMIN_MODULE + `/hotels/export`, params)
}
/**
* 收藏
* @param params
* @returns {*}
*/
export const collectedApi  = (params: { id: string }) => {
  const { id } = params
  return http.get(ADMIN_MODULE + `/hotels/collect/${id}`)
}

/**
* 取消收藏
* @param params
* @returns {*}
*/
export const disCollectedApi  = (params: { id: string }) => {
  const { id } = params
  return http.get(ADMIN_MODULE + `/hotels/disCollect/${id}`)
}

/**
* 获取用户收藏列表
* @param params
* @returns {*}
*/
export const getCollectionApi  = () => {
  return http.get<IHotels.Row[]>(ADMIN_MODULE + `/hotels/collection`)
}
/**
 * 搜索接口ES
 * @returns huoque
 */
export const getSearchHotelId = (params: {keywords:string[], dateStart: String, dateEnd: String}): Promise<any> => {
  return http.post(ADMIN_MODULE + `/hotels/search`, params);
}