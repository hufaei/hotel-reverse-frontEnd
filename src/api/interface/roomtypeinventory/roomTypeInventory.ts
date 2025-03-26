import type { IPageQuery } from '@/api/interface'

export namespace IRoomTypeInventory {

  // 查询条件
  export interface Query extends IPageQuery {
    roomTypeId?: string
    date?: string
    availableQuantity?: number
  }

  // 编辑form表单
  export interface Form {
    roomTypeId?: string
    date?: string
    availableQuantity?: number
 }

  // list或detail返回结构
  export interface Row {
    roomTypeId?: string
    date?: string
    availableQuantity?: number
  }

}