export interface IFieldPath {
    name: string ///displayName для отображения на форме настроек
    apiField: string
    sortable?: boolean
    child?: IFieldPath
}