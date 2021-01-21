/** Настройка поля */ 
export interface IFieldPath {
    /** Наименование для сортировки */ 
    displayName: string
    /** Имя поля (как на бэке) */ 
    apiField: string
    /** Алиас для данных */ 
    alias?: string
    /** Можно ли сортировать по этому полю */ 
    sortable?: boolean
    /** Вложенный объект */ 
    child?: IFieldPath
}

/** Укороченная версия IFieldPath */ 
export interface IFieldPathShort extends Omit<IFieldPath, "displayName" | "sortable" | "child"> {
    child?: IFieldPathShort
}