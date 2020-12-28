import { IFieldPathShort } from "../types/IFieldPath";
import { ITableColumnGroupSettings, ITableColumnSettings, ITableSettings, TableColumn } from "../types/ITableSettings";
import { ITableUserColumnGroupSettings, ITableUserSettings, TableUserColumn } from "../types/ITableUserSettings";


export default function generateSelectQuery(tableSettings: ITableSettings, gridUserSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean) {
  const typeName = tableSettings.typeName;
  const typePluralName = tableSettings.typePluralName[0].toLowerCase() + tableSettings.typePluralName.slice(1);

  function getTextField(fieldPath: IFieldPathShort): string {
    if (!fieldPath.child) {
      return (fieldPath.alias ? fieldPath.alias + ": " : "") + fieldPath.apiField
    }
    else {
      return (fieldPath.alias ? fieldPath.alias + ": " : "") + fieldPath.apiField + "\n{\n" + getTextField(fieldPath.child) + "\n}"
    }
  }

  const items: string[] = [];

  if (!onlyKeysForSelectedAll) {

    const setItems = (tableUserColumns: TableUserColumn[], tableColumns: TableColumn[]) => {
      tableUserColumns.filter(tableUserColumn => tableUserColumn.visible).forEach((tableUserColumn) => {
        const tableUserGroupColumn = tableUserColumn as ITableUserColumnGroupSettings
        const tableColumnSettings = tableColumns.find((tableColumn) => tableColumn.name === tableUserColumn.name)
        const tableColumnGroupSettings = tableColumnSettings as ITableColumnGroupSettings

        if (tableUserGroupColumn.columns && tableColumnGroupSettings.columns) {
          setItems(tableUserGroupColumn.columns, tableColumnGroupSettings.columns)
        }
        else {
          const tableColumnSettingsData = tableColumnSettings as ITableColumnSettings
          if (tableColumnSettingsData) {
            if (tableColumnSettingsData.fields) {
              tableColumnSettingsData.fields.forEach((fieldCol) => {
                items.push(getTextField(fieldCol));
              })
            }
            else {
              items.push(tableColumnSettingsData.name);
            }
          }
        }
      })
    }

    setItems(gridUserSettings.columns, tableSettings.columns)

    tableSettings.defaultLoadFields?.forEach((fieldCol) => {
      items.push(getTextField(fieldCol));
    })

  }

  tableSettings.keyFields.forEach((c) => {
    items.push(c);
  })

  const selectQuery = `query (
        $after: String
        $first: Int
        $before: String
        $last: Int
        $orderby: [${typeName}OrderItemInput!]
        $filter: ${typeName}QueryFilterInput
      ) {
        ${typePluralName}Pg(
          after: $after,
          first: $first,
          before: $before,
          last: $last,
          orderby: $orderby,
          filter: $filter
        ) {
          totalCount
          items {
           ${items.join("\n")}
          }
        }
      }`

  return selectQuery;
}
