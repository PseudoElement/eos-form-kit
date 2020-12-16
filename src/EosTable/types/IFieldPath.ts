export interface IFieldPath {
    displayName: string
    apiField: string
    sortable?: boolean
    child?: IFieldPath
}