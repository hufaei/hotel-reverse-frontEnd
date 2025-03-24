import type { IPageQuery } from '@/api/interface'

export namespace IAdmins {

  // 查询条件
  export interface Query extends IPageQuery {
    username?: string
    passwordHash?: string
    email?: string
    createdAtStart?: string
    createdAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    adminId?: number
    username?: string
    passwordHash?: string
    email?: string
    createdAt?: string
 }

  // list或detail返回结构
  export interface Row {
    adminId?: number
    username?: string
    passwordHash?: string
    email?: string
    createdAt?: string
  }

}