import { FilterExpressionFragment } from "./IFilterType";
import { ISorterPath } from "./ISorterType";


export interface ITableUserSettings {
    tableId: string
    filterVisible?: boolean
    pageSize?: number
    columns: TableUserColumn[]
    defaultFilters?: Map<string, FilterExpressionFragment>
    defaultSort?: ISorterPath[]
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