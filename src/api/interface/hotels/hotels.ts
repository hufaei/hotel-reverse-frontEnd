import type { IPageQuery } from '@/api/interface'

export namespace IHotels {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: number
    hotelName?: string
    address?: string
    latitude?: number
    longitude?: number
    contactEmail?: string
    contactPhone?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    hotelId?: number
    hotelName?: string
    address?: string
    latitude?: number
    longitude?: number
    contactEmail?: string
    contactPhone?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    hotelId?: number
    hotelName?: string
    address?: string
    latitude?: number
    longitude?: number
    contactEmail?: string
    contactPhone?: string
    createdAt?: string
  }

}