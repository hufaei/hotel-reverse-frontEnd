import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IReviews } from '@/api/interface/reviews/reviews'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getReviewsListApi = (params: IReviews.Query) => {
  return http.get<IPage<IReviews.Row>>(ADMIN_MODULE + `/reviews`, params)
}
/**
 * 获取用户评论简介视图
 * @param params 
 * @returns 
 */
export const getUserTotalReviews = (params: { id: number ,bookingId?: string }) => {
  const { id ,bookingId} = params;
  return http.get<IReviews.UserRow>(ADMIN_MODULE + `/reviews/user/${id}/${bookingId}`)
}
/**
* 添加
* @param params
* @returns {*}
*/
export const createReviewsApi = (params: IReviews.Form) => {
  return http.post(ADMIN_MODULE + `/reviews`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateReviewsApi = (params: IReviews.Form) => {
  return http.put(ADMIN_MODULE + `/reviews`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeReviewsApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/reviews`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getReviewsDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IReviews.Row>(ADMIN_MODULE + `/reviews/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importReviewsExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/reviews/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportReviewsExcelApi  = (params: IReviews.Query) => {
  return http.download(ADMIN_MODULE + `/reviews/export`, params)
}