export interface IFieldPath {
    displayName: string
    apiField: string
    alias?: string
    sortable?: boolean
    child?: IFieldPath
}