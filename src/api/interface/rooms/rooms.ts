import type { IPageQuery } from '@/api/interface'

export namespace IRooms {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: string
    roomNumber?: string
    roomStatus?: string
    roomType?: string
  }

  // form表单
  export interface Form {
    roomId?: number
    hotelId?: string
    roomNumber?: string
    roomStatus?: string
    roomType?: string
    price?: number
 }

  // list或detail返回结构
  export interface Row {
    roomId?: number
    hotelId?: string
    roomNumber?: string
    roomStatus?: string
    roomType?: string
  }

  export interface IdUpdate {
    roomId?: number
  }

}