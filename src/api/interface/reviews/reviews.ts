import type { IPageQuery } from '@/api/interface'

export namespace IReviews {

  // 查询条件
  export interface Query extends IPageQuery {
    bookingId?: number
    userId?: number
    ratingCeil?: number
    ratingFloor?: number
    createdAtStart?: string
    createdAtEnd?: string
  }

  // form表单
  export interface Form {
    reviewId?: number
    bookingId?: number
    userId?: number
    rating?: number
    healthRate?: number
    envRate?: number
    serviceRate?: number
    facilitiesRate?: number
    comment?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    reviewId?: number
    bookingId?: number
    userId?: number
    rating?: number
    healthRate?: number
    envRate?: number
    serviceRate?: number
    facilitiesRate?: number
    comment?: string
    createdAt?: string
  }

}