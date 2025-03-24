import type { IPageQuery } from '@/api/interface'

export namespace IReviews {

  // 查询条件
  export interface Query extends IPageQuery {
    bookingId?: number
    userId?: number
    rating?: number
    comment?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    reviewId?: number
    bookingId?: number
    userId?: number
    rating?: number
    comment?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    reviewId?: number
    bookingId?: number
    userId?: number
    rating?: number
    comment?: string
    createdAt?: string
  }

}