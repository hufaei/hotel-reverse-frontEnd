import type { IPageQuery } from '@/api/interface'

export namespace IBookings {

  // 查询条件
  export interface Query extends IPageQuery {
    bookingId?: number
    userId?: number
    hotelId?: number
    roomId?: number
    username?: string
    userPhone?: string
    bookingDateStart?: string
    bookingDateEnd?: string
    status?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    bookingId?: number
    userId?: number
    hotelId?: number
    roomId?: number
    username?: string
    userPhone?: string
    bookingDate?: string
    status?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    bookingId?: number
    userId?: number
    hotelId?: number
    roomId?: number
    username?: string
    userPhone?: string
    bookingDate?: string
    status?: string
    createdAt?: string
  }

}