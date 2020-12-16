import { IFieldPath } from "./IFieldPath";

export interface IColumn {
    key: string
    dataIndex: string
    title?: string
    sorter?: boolean | { multiple: number }
    editable?: boolean
    fixed?: boolean
    width?: number
    render?: (value: any, record: any, index: any) => JSX.Element | undefined
    defaultSortOrder?: any
    description?: string
    sorterOrder?: {
        priority: number
        direction?: "Asc" | "Desc"
    }
    sorterField?: IFieldPath
}