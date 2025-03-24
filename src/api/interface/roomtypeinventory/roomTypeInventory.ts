import type { IPageQuery } from '@/api/interface'

export namespace IRoomTypeInventory {

  // 查询条件
  export interface Query extends IPageQuery {
    roomTypeId?: number
    date?: string
    availableQuantity?: number
  }

  // 编辑form表单
  export interface Form {
    roomTypeId?: number
    date?: string
    availableQuantity?: number
 }

  // list或detail返回结构
  export interface Row {
    roomTypeId?: number
    date?: string
    availableQuantity?: number
  }

}