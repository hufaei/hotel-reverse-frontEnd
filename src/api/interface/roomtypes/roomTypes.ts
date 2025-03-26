import type { IPageQuery } from '@/api/interface'

export namespace IRoomTypes {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: String
    roomType?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    roomTypeId?: String
    hotelId?: String
    roomType?: string
    price?: number
    photoUrls?: string
    info?: string
    description?: string
 }

  // list或detail返回结构
  export interface Row {
    roomTypeId?: String
    hotelId?: String
    roomType?: string
    price?: number
    photoUrls?: string
    info?: string
    description?: string
    createdAt?: string
  }

}