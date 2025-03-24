import type { IPageQuery } from '@/api/interface'

export namespace IUsers {

  // 查询条件
  export interface Query extends IPageQuery {
    userId?: number
    username?: string
    email?: string
    phone?: string
    passwordHash?: string
    createdAtStart?: string
    createdAtEnd?: string
    isDeleted?: number
  }

  // 编辑form表单
  export interface Form {
    userId?: number
    username?: string
    email?: string
    phone?: string
    passwordHash?: string
    createdAt?: string
    isDeleted?: number
 }

  // list或detail返回结构
  export interface Row {
    userId?: number
    username?: string
    email?: string
    phone?: string
    createdAt?: string
  }

}