export interface ISorterType {
    name: string
    sorterPath?: ISorterPath
    children?: ISorterType[]
    columnName?: string
}

export interface ISorterPath {
    [key: string]: SorterPathType
}

export type SorterPathType = ISorterPath | DirectionSort

export type DirectionSort = "Asc" | "Desc" | undefined