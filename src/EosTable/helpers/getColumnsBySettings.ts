import { IColumn } from "../types/IColumn";
import { FetchControlRender } from "../types/ITableProvider";
import { ITableSettings } from "../types/ITableSettings";
import { IColumnUserSettings } from "../types/ITableUserSettings";

export function getColumnsBySettings(tableSettings: ITableSettings,
    gridColumns: IColumnUserSettings[],
    fetchControl?: FetchControlRender,
    localize?: (key?: string) => string
): IColumn[] {
    const columns: IColumn[] = [];
    gridColumns
        .filter(c => c.visible)
        .forEach(c => {
            const gridColSettings = tableSettings.columns.find(gridCol => gridCol.name === c.name);
            if (gridColSettings) {
                const render = gridColSettings.columnRender?.renderType !== undefined && fetchControl && fetchControl(gridColSettings.columnRender?.renderType)
                const title = localize ? localize(gridColSettings.title) : gridColSettings.title
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
                    sorter: gridColSettings.sortable,
                    width: width,
                    //defaultSortOrder: defaultSortOrder,
                    description: localize ? localize(gridColSettings.description) : gridColSettings.description,
                    //sorterOrder: c.sorter,
                    //sorterField: gridColSettings.sorter
                };
                if (render) {
                    column.render = (value: any, record: any, index: any) =>
                        render({ valueInCell: value, recordInRow: record, indexOfRow: index, renderArgs: { ellipsisRows: tableSettings.visual?.ellipsisRows, ...gridColSettings.columnRender?.renderArgs } })
                }
                columns.push(column);
            }
        });
    return columns;
}
