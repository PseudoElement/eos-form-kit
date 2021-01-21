import DefaultDisplay from "../components/ColumnRender/Default";
import { ISorterType } from "../types";
import { IColumn } from "../types/IColumn";
import { DirectionSort } from "../types/ISorterType";
import { FetchControlRender } from "../types/ITableProvider";
import { ITableColumnGroupSettings, ITableColumnSettings, ITableSettings, TableColumn } from "../types/ITableSettings";
import { ITableUserColumnGroupSettings, ITableUserSettings, TableUserColumn } from "../types/ITableUserSettings";

export function getColumnsBySettings(tableSettings: ITableSettings,
    tableUserSettings: ITableUserSettings,
    fetchControl?: FetchControlRender,
    fetchControlGlobal?: FetchControlRender,
    localize?: (key?: string) => string,
    ellipsisRows?: number,
    listPossibleSorting?: ISorterType[]
): IColumn[] {

    const defaultSortings = getSorterColumnByUserSetting(tableUserSettings, listPossibleSorting)

    const pushColumns = (tableColumns: TableUserColumn[], tableUserColumns: TableColumn[]) => {
        const columns: IColumn[] = [];

        tableColumns
            .filter(c => c.visible)
            .forEach(c => {

                const parentUserColumnGroupSettings = c as ITableUserColumnGroupSettings
                const gridColSettings = tableUserColumns.find(gridCol => gridCol.name === c.name)

                if (gridColSettings) {
                    const gridColSettingsGroup = gridColSettings as ITableColumnGroupSettings

                    if (parentUserColumnGroupSettings.columns && gridColSettingsGroup.columns) {
                        const column: IColumn = {
                            key: c.name,
                            fixed: c.fixed,
                            width: c.width,
                            children: pushColumns(parentUserColumnGroupSettings.columns, gridColSettingsGroup.columns),
                            title: gridColSettings.title
                        }
                        columns.push(column)
                    }
                    else {
                        const tableColumnSettings = gridColSettings as ITableColumnSettings
                        if (tableColumnSettings) {
                            const render = (tableColumnSettings.columnRender?.renderType !== undefined &&
                                (
                                    (fetchControl && fetchControl(tableColumnSettings.columnRender?.renderType))
                                    ||
                                    (fetchControlGlobal && fetchControlGlobal(tableColumnSettings.columnRender?.renderType))
                                ))
                                || (fetchControlGlobal && fetchControlGlobal("DefaultDisplay"))

                            const title = localize ? localize(tableColumnSettings.title) : tableColumnSettings.title
                            let width = c.width
                            if (!width && title) {
                                width = title.length * 20
                            }
                            let sorter: any = false
                            let direction: any = undefined
                            if (tableColumnSettings.sortable) {
                                const defaultSortIndex = defaultSortings?.findIndex(s => s.columnName === c.name)
                                if (defaultSortIndex > -1) {
                                    sorter = { multiple: defaultSortIndex }
                                    if (defaultSortings[defaultSortIndex].direction) {
                                        direction = defaultSortings[defaultSortIndex].direction === "Asc" ? "ascend" : "descend"
                                    }
                                }
                                else {
                                    sorter = true
                                }
                            }
                            const column: IColumn = {
                                key: c.name as string,
                                dataIndex: c.name as string,
                                title: title,
                                //editable: gridColSettings.columnRender?.isEditable,
                                fixed: c.fixed,
                                sorter: sorter,
                                width: width,
                                description: localize ? localize(tableColumnSettings.description) : tableColumnSettings.description,
                                defaultSortOrder: direction
                            };
                            if (render) {
                                column.render = (value: any, record: any, index: any) =>
                                    render({ valueInCell: value, recordInRow: record, indexOfRow: index, renderArgs: { ellipsisRows: ellipsisRows, ...tableColumnSettings.columnRender?.renderArgs } })
                            }
                            columns.push(column);
                        }
                    }
                }
            });

        return columns
    }

    return pushColumns(tableUserSettings.columns, tableSettings.columns)
}

function getSorterColumnByUserSetting(tableUserSettings: ITableUserSettings, listPossibleSorting?: ISorterType[]) {
    const sorterColumns: ISorterType[] = []
    if (!listPossibleSorting)
        return sorterColumns

    tableUserSettings.defaultSort?.forEach((defSort) => {
        let direction: DirectionSort = undefined
        const possSort = listPossibleSorting.find(s => s.json === JSON.stringify(defSort, (_key, value) => {
            if (value === "Asc" || value === "Desc") {
                direction = value
                return {}
            }
            return value
        }))

        if (possSort) {
            sorterColumns.push({ ...possSort, direction })
        }
    })
    return sorterColumns

}
