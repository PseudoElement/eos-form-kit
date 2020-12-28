import { IFieldPath } from "../types/IFieldPath";
import { DirectionSort, ISorterPath, ISorterType } from "../types/ISorterType";
import { ITableColumnGroupSettings, ITableColumnSettings, ITableSettings, TableColumn } from "../types/ITableSettings";

export function getPossibleSortings(tableSettings: ITableSettings, localize?: (key: string) => string) {
    let possibleSortingsTree: ISorterType[] = []
    const possibleSortings: ISorterType[] = []

    const getSorterByField = (field: IFieldPath, sorterTypeCurrent: ISorterType, columnName: string, sorterPath?: ISorterPath): any => {
        const sortPath: ISorterPath = addChildToSorterTypeParent({ [field.apiField]: {} }, sorterPath)
        const newSorter = { ...sorterTypeCurrent }
        if (field.child) {
            const nameField = localize ? localize(field.child.displayName) : field.child.displayName
            const sorterChild = sorterTypeCurrent.children?.find(s => s.name === nameField) ?? { name: nameField }
            const sortingChanged = getSorterByField(field.child, sorterChild, columnName, sortPath)
            if (sortingChanged) {
                if (sorterTypeCurrent.children) {
                    const newArr = [...sorterTypeCurrent.children?.filter(s => s.name !== nameField), sortingChanged]
                    newSorter.children = newArr
                }
                else {
                    newSorter.children = [sortingChanged]
                }
            }
            return (newSorter.children) ? newSorter : undefined
        }
        else {
            if (field.sortable) {
                newSorter.sorterPath = sortPath
                newSorter.json = JSON.stringify(sortPath)
                newSorter.columnName = columnName
                possibleSortings.push(newSorter)
                return newSorter
            }
            return undefined
        }
    }

    const getPossibleSortingsTree = (tableColumnsSettings: TableColumn[]) => {
        tableColumnsSettings.forEach((column) => {
            const columnGroup = column as ITableColumnGroupSettings
            const columnData = column as ITableColumnSettings

            if (columnGroup.columns) {
                getPossibleSortingsTree(columnGroup.columns)
            }
            else {
                const fields = columnData.fields
                if (!fields) return
                fields.forEach((field) => {
                    const sorterTypeCurrent = possibleSortingsTree.find(s => s.name === field.displayName) ?? { name: field.displayName }
                    const sortingChanged = getSorterByField(field, sorterTypeCurrent, column.name)
                    if (sortingChanged) {
                        possibleSortingsTree = [...possibleSortingsTree.filter(s => s.name !== field.displayName), sortingChanged]
                    }

                })
            }
        })
    }
    getPossibleSortingsTree(tableSettings.columns)

    return { tree: possibleSortingsTree, list: possibleSortings }
}

export function setDirectionToSortPath(sorterPath: ISorterPath, direction: DirectionSort) {
    const relation = Object.keys(sorterPath)[0]
    const value = sorterPath[relation];
    if (isEmpty(value)) {
        const newObj = Object.create(sorterPath) as ISorterPath
        newObj[relation] = direction
        return newObj
    }
    else {
        const newObj = Object.create(sorterPath) as ISorterPath
        newObj[relation] = setDirectionToSortPath(value as ISorterPath, direction)
        return newObj
    }
}

function addChildToSorterTypeParent(child: ISorterPath, sorterPath?: ISorterPath) {
    if (sorterPath === undefined)
        return child

    const sortPath = { ...sorterPath }
    const relation = Object.keys(sortPath)[0]
    const value = sortPath[relation];
    if (isEmpty(value)) {
        sortPath[relation] = child
    }
    else {
        sortPath[relation] = addChildToSorterTypeParent(child, value as ISorterPath)
    }
    return sortPath
}

function isEmpty(obj: any) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}