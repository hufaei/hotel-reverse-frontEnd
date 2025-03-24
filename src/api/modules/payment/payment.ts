import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IPayment } from '@/api/interface/payment/payment'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getPaymentListApi = (params: IPayment.Query) => {
  return http.get<IPage<IPayment.Row>>(ADMIN_MODULE + `/payment`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createPaymentApi = (params: IPayment.Form) => {
  return http.post(ADMIN_MODULE + `/payment`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updatePaymentApi = (params: IPayment.Form) => {
  return http.put(ADMIN_MODULE + `/payment`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removePaymentApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/payment`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getPaymentDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IPayment.Row>(ADMIN_MODULE + `/payment/${id}`)
}

