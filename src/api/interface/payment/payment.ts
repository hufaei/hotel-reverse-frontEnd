import type { IPageQuery } from '@/api/interface'

export namespace IPayment {

  // 查询条件
  export interface Query extends IPageQuery {
    paymentId?: number
    bookingId?: number
    paymentStatus?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    paymentId?: number
    bookingId?: number
    amount?: number
    paymentStatus?: string
    reason?: string
 }

  // list或detail返回结构
  export interface Row {
    paymentId?: number
    bookingId?: number
    amount?: number
    paymentStatus?: string
    reason?: string
    createdAt?: string
  }

}