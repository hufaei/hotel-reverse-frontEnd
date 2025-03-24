import type { IPageQuery } from '@/api/interface'

export namespace IHotelOwners {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: number
    name?: string
    email?: string
    phone?: string
    passwordHash?: string
    createdAtStart?: string
    createdAtEnd?: string
    isDeleted?: number
  }

  // 编辑form表单
  export interface Form {
    ownerId?: number
    hotelId?: number
    name?: string
    email?: string
    phone?: string
    passwordHash?: string
    createdAt?: string
    isDeleted?: number
 }

  // list或detail返回结构
  export interface Row {
    ownerId?: number
    hotelId?: number
    name?: string
    email?: string
    phone?: string
    passwordHash?: string
    createdAt?: string
    isDeleted?: number
  }

}