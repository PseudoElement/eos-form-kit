import DefaultDisplay from "../components/ColumnRender/Default";
import { IColumn } from "../types/IColumn";
import { FetchControlRender } from "../types/ITableProvider";
import { ITableColumnGroupSettings, ITableColumnSettings, ITableSettings, TableColumn } from "../types/ITableSettings";
import { ITableUserColumnGroupSettings, TableUserColumn } from "../types/ITableUserSettings";

export function getColumnsBySettings(tableSettings: ITableSettings,
    gridColumns: TableUserColumn[],
    fetchControl?: FetchControlRender,
    fetchControlGlobal?: FetchControlRender,
    localize?: (key?: string) => string
): IColumn[] {
    //const columns: IColumn[] = [];


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
                            const render = tableColumnSettings.columnRender?.renderType !== undefined &&
                                (
                                    (fetchControl && fetchControl(tableColumnSettings.columnRender?.renderType))
                                    ||
                                    (fetchControlGlobal && fetchControlGlobal(tableColumnSettings.columnRender?.renderType))
                                    ||
                                    DefaultDisplay
                                )
                            const title = localize ? localize(tableColumnSettings.title) : tableColumnSettings.title
                            let width = c.width
                            if (!width && title) {
                                width = title.length * 20
                            }
                            const column: IColumn = {
                                key: c.name as string,
                                dataIndex: c.name as string,
                                title: title,
                                //editable: gridColSettings.columnRender?.isEditable,
                                fixed: c.fixed,
                                sorter: tableColumnSettings.sortable,
                                width: width,
                                description: localize ? localize(tableColumnSettings.description) : tableColumnSettings.description,
                            };
                            if (render) {
                                column.render = (value: any, record: any, index: any) =>
                                    render({ valueInCell: value, recordInRow: record, indexOfRow: index, renderArgs: { ellipsisRows: tableSettings.visual?.ellipsisRows, ...tableColumnSettings.columnRender?.renderArgs } })
                            }
                            columns.push(column);
                        }
                    }
                }
            });

        return columns
    }

    return pushColumns(gridColumns, tableSettings.columns)
}
