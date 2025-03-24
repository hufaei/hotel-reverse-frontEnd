import type { IPageQuery } from '@/api/interface'

export namespace IRoomTypes {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: number
    roomType?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    roomTypeId?: number
    hotelId?: number
    roomType?: string
    price?: number
    photoUrls?: string
    size?: number
    description?: string
 }

  // list或detail返回结构
  export interface Row {
    roomTypeId?: number
    hotelId?: number
    roomType?: string
    price?: number
    photoUrls?: string
    size?: number
    description?: string
    createdAt?: string
  }

}