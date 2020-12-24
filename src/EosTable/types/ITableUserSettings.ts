import { FilterExpressionFragment } from "./IFilterType";
import { ISorterPath } from "./ISorterType";


export interface ITableUserSettings{
    tableId: string
    filterVisible?: boolean,
    pageSize?: number,
    columns: IColumnUserSettings[]
    defaultFilters?: Map<string, FilterExpressionFragment>     
    defaultSort?: ISorterPath[]
}

export interface IColumnUserSettings{
    name: string
    visible: boolean,
    width?: number,
    fixed?: boolean,     
    //isGroup?: boolean    
}