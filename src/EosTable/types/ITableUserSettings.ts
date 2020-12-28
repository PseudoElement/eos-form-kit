import { IFilterValueObjects } from "./IFilterValueObjects";
import { ISorterPath } from "./ISorterType";


export interface ITableUserSettings {
    tableId: string
    filterVisible?: boolean
    pageSize?: number
    columns: TableUserColumn[]
    defaultFilters?: IFilterValueObjects
    defaultSort?: ISorterPath[]
    highlightingRows?: boolean
    ellipsisRows?: number
}

export interface ITableColumnUserSettings {
    name: string
    visible: boolean
    width?: number
    fixed?: boolean
}

export type TableUserColumn = ITableUserColumnGroupSettings | ITableColumnUserSettings

export interface ITableUserColumnGroupSettings extends ITableColumnUserSettings {
    columns: TableUserColumn[]
}