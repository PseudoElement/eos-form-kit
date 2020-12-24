
import { IMenuItem } from "../../Menu/types";
import { IFieldPath } from "./IFieldPath";
import { FilterExpressionFragment } from "./IFilterType";

export interface ITableSettings {
    tableId: string
    typeName: string
    typePluralName: string
    columns: ITableColumnSettings[]
    keyFields: string[]
    visual?: IVisualSettings
    quickSearchFilter?: Omit<IFieldPath, "displayName" | "sortable">[] /// func(tableState, tableSettings, userTableSettings) => FilterExpressionFragment
    menu?: IMenuItem[]
    rightMenu?: IMenuItem[]
    contextMenu?: any
    dataProviderName?: string
    ///cardView?: ICard    
    minSelectedRecords?: number
    maxSelectedRecords?: number
    defaultLoadFields?: Omit<IFieldPath, "displayName" | "sortable">[]
    constFilter?: FilterExpressionFragment
    ///formFilter: Map<string(key form), Rule>   /// func(tableState, tableSettings, userTableSettings) => FilterExpressionFragment
    filterExpressionTemplates?: IFilterExpressionTemplates
}

type ColumnGroups = IColumnGroup | ITableColumnSettings ///?

interface IColumnGroup {
    name: string
    title: string
    culumnGroups: ColumnGroups[]
}

export interface ITableColumnSettings {
    name: string
    fields?: IFieldPath[]
    title: string
    description?: string
    columnRender?: IRender
    sortable?: boolean
    ///selectValues?: Map<string, string>
}

export interface IField {
    name: string
    children?: IField[]
}

export interface IFieldSort {
    name: string
    child?: IFieldSort
}

export interface IVisualSettings {
    isDifferentRow?: boolean
    dragable?: boolean
    resizable?: boolean
    bordered?: "header" | "all" | undefined
    fixedColumn?: boolean
    showSelectedBtn?: boolean,
    ellipsisRows?: number
    pageSizeOptions?: string[]
}

export interface IRender {
    renderType: string,
    renderArgs?: IRenderArgs,
}

export interface IRenderArgs {
    ellipsisRows?: number
    iconName?: string
    iconSize?: string
    iconColor?: string
    mode?: string
    typeButton?: 'primary' | 'link' | 'default'
    titleButton?: string
    [key: string]: string | number | undefined
}

interface IFilterExpressionTemplates {
    quickSearchFilter?: FilterExpressionFragment
    formFilter?: IFormFilterExpressionTemplate[]
}

interface IFormFilterExpressionTemplate {
    fieldName: string
    template: FilterExpressionFragment
}