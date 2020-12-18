import { FilterType } from "./IFilterType";
import { ISorterPath } from "./ISorterType";

export interface ITableState {
    readonly after?: number, ///string  firstCursor lastCursor
    selectedRecords?: any[]
    readonly currentRecord?: any
    readonly tableData?: any[]
    pageSize?: number,
    orderby?: ISorterPath[]
    filter?: Map<string, FilterType>
    selectedRowKeys?: string[]
    currentRowKey?: string
    maxSelectedRecords?: number
    minSelectedRecords?: number
    currentPage?: number
    tableView?: "table" | "card"
    forcedReloadData?: boolean
    quickSearchMode?: boolean | { mode: string }
    readonly lastUnSelectedRecords?: any[]
}
