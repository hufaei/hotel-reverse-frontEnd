import type { IPageQuery } from '@/api/interface'

export namespace IRooms {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: number
    roomNumber?: string
    roomType?: string
    price?: number
    size?: number
    bedInfo?: string
    capacity?: number
    availability?: number
  }

  // 编辑form表单
  export interface Form {
    roomId?: number
    hotelId?: number
    roomNumber?: string
    roomType?: string
    price?: number
    size?: number
    bedInfo?: string
    capacity?: number
    availability?: number
 }

  // list或detail返回结构
  export interface Row {
    roomId?: number
    hotelId?: number
    roomNumber?: string
    roomType?: string
    price?: number
    size?: number
    bedInfo?: string
    capacity?: number
    availability?: number
  }

}