export interface IFieldPath {
    displayName: string
    apiField: string
    alias?: string
    sortable?: boolean
    child?: IFieldPath
}

export interface IFieldPathShort extends Omit<IFieldPath, "displayName" | "sortable" | "child"> {
    child?: IFieldPathShort
}