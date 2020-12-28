export interface ISorterType {
    name: string
    sorterPath?: ISorterPath
    children?: ISorterType[]
    columnName?: string
    json?: string
    direction?: DirectionSort
}

export interface ISorterPath {
    [key: string]: SorterPathType
}

export type SorterPathType = ISorterPath | DirectionSort

export type DirectionSort = "Asc" | "Desc" | undefined