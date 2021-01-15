import { FilterExpressionFragment } from "./IFilterType";
import { IFilterValueObjects } from "./IFilterValueObjects";
import { ISorterPath } from "./ISorterType";

export interface ITableState {
    readonly after?: number, ///string  firstCursor lastCursor
    selectedRecords?: any[]
    readonly currentRecord?: any
    readonly tableData?: any[]
    pageSize?: number,
    orderby?: ISorterPath[]
    filter?: Map<string, FilterExpressionFragment>
    selectedRowKeys?: string[]
    currentRowKey?: string
    maxSelectedRecords?: number
    minSelectedRecords?: number
    currentPage?: number
    tableView?: "default" | "card"
    forcedReloadData?: boolean
    quickSearchMode?: boolean
    readonly lastUnSelectedRecords?: any[]
    showFormFilter?: boolean
    readonly formFilterMode?: boolean
    filterValueObjects?: IFilterValueObjects
    filterAreaHeight?: number
}
