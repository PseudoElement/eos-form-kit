import { IMenuItem } from "../../Menu/types";
import { IFieldPath, IFieldPathShort } from "./IFieldPath";
import { FilterExpressionFragment } from "./IFilterType";

export interface ITableSettings {
    tableId: string
    typeName: string
    typePluralName: string
    columns: TableColumn[]
    keyFields: string[]
    visual?: IVisualSettings
    quickSearchFilter?: IFieldPathShort[]
    menu?: IMenuItem[]
    rightMenu?: IMenuItem[]
    contextMenu?: any
    dataProviderName?: string
    ///cardView?: ICard    
    minSelectedRecords?: number
    maxSelectedRecords?: number
    defaultLoadFields?: IFieldPathShort[]
    constFilter?: FilterExpressionFragment    
}

export type TableColumn = ITableColumnGroupSettings | ITableColumnSettings

export interface ITableColumnGroupSettings {
    name: string
    title: string
    columns: TableColumn[]
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