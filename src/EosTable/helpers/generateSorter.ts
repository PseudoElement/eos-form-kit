import { IColumn } from "../types/IColumn";
import { IFieldPath } from "../types/IFieldPath";
import { DirectionSort, ISorterPath, ISorterType } from "../types/ISorterType";
import { ITableSettings } from "../types/ITableSettings";

export function getPossibleSortings(tableSettings: ITableSettings, localize?: (key: string) => string) {
    let possibleSortingsTree: ISorterType[] = []
    const possibleSortings: ISorterType[] = []

    const getSorterByField = (field: IFieldPath, sorterTypeCurrent: ISorterType, columnName: string, sorterPath?: ISorterPath): any => {
        const sortPath: ISorterPath = addChildToSorterTypeParent({ [field.apiField]: undefined }, sorterPath)
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
                newSorter.columnName = columnName
                possibleSortings.push(newSorter)
                return newSorter
            }
            return undefined
        }
    }

    tableSettings.columns.forEach((column) => {
        const fields = column.fields
        if (!fields) return
        fields.forEach((field) => {
            const sorterTypeCurrent = possibleSortingsTree.find(s => s.name === field.displayName) ?? { name: field.displayName }
            const sortingChanged = getSorterByField(field, sorterTypeCurrent, column.name)
            if (sortingChanged) {
                possibleSortingsTree = [...possibleSortingsTree.filter(s => s.name !== field.displayName), sortingChanged]
            }

        })
    })

    return { tree: possibleSortingsTree, list: possibleSortings }
}

export function setDirectionToSortPath(sorterPath: ISorterPath, direction: DirectionSort) {
    const relation = Object.keys(sorterPath)[0]
    const value = sorterPath[relation];
    if (value === undefined) {
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
    if (value === undefined) {
        sortPath[relation] = child
    }
    else {
        sortPath[relation] = addChildToSorterTypeParent(child, value as ISorterPath)
    }
    return sortPath
}

export function generateSorter(columns: IColumn[]) {
    const orderItems: any[] = [];
    columns.filter(c => c.sorter).sort((a, b) => {
        if (a.sorterOrder && b.sorterOrder) { return a.sorterOrder.priority - b.sorterOrder.priority; } return 0;
    }).forEach((column) => {
        if (column.sorterOrder && column.sorterOrder.direction) {
            if (column.sorterField && column.sorterOrder) {
                orderItems.push(getSorterObject(column.sorterField, column.sorterOrder.direction));
            }
            else {
                orderItems.push({ [column.dataIndex]: column.sorterOrder.direction });
            }
        }
    })

    return orderItems.length === 0 ? undefined : orderItems;
}

function getSorterObject(fieldSort: IFieldPath, orderType: string): any {
    if (typeof fieldSort === "string") {
        return { [fieldSort]: orderType }
    }
    else {
        const relation = Object.keys(fieldSort)[0]
        const value = fieldSort[relation];
        const child = getSorterObject(value, orderType);
        return { [relation]: child }
    }
}
