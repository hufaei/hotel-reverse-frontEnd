import type { IPageQuery } from '@/api/interface'

export namespace IHotels {

  // 查询条件
  export interface Query extends IPageQuery {
    hotelId?: String
    hotelName?: string
    address?: string
    province?: string
    city?: string
    country?: string
    stars?: number
    latitude?: number
    longitude?: number
    contactPhone?: string
    getOpeningDateStart?: string
    getOpeningDateEnd?: string
  }

  // 编辑form表单
  export interface Form {
    hotelId?: String
    hotelName?: string
    englishName?: string
    province?: string
    city?: string
    country?: string
    stars?: number
    openingYear?: number
    renovationYear?: number
    address?: string
    latitude?: number
    longitude?: number
    roomCount?: number
    description?: string
    traffic?: string
    roomTypeList?: string
    contactPhone?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    hotelId?: String
    hotelName?: string
    englishName?: string
    province?: string
    city?: string
    country?: string
    stars?: number
    openingYear?: number
    renovationYear?: number
    address?: string
    latitude?: number
    longitude?: number
    roomCount?: number
    description?: string
    traffic?: string
    roomTypeList?: string
    contactPhone?: string
    createdAt?: string
  }

}