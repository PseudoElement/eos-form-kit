import { IFieldPath } from "../types/IFieldPath";
import { ITableSettings } from "../types/ITableSettings";
import { ITableUserSettings } from "../types/ITableUserSettings";


export default function generateSelectQuery(tableSettings: ITableSettings, gridUserSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean) {
  const typeName = tableSettings.typeName;
  const typePluralName = tableSettings.typePluralName[0].toLowerCase() + tableSettings.typePluralName.slice(1);

  function getTextField(fieldPath: Omit<IFieldPath, "name" | "sortable">): string {
    if (!fieldPath.child) {
      return fieldPath.apiField
    }
    else {
      return fieldPath.apiField + "\n{\n" + getTextField(fieldPath.child) + "\n}"
    }
  }

  const items: string[] = [];

  if (!onlyKeysForSelectedAll) {

    gridUserSettings.columns.filter(c => c.visible).forEach((c) => {
      let gridCol = tableSettings.columns.find((gridCol) => gridCol.name === c.name);
      if (gridCol) {
        if (gridCol.fields) {
          gridCol.fields.forEach((fieldCol) => {
            items.push(getTextField(fieldCol));
          })
        }
        else {
          items.push(gridCol.name);
        }
      }
    });

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