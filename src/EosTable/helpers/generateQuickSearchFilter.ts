import { IFieldPath } from "../types/IFieldPath";
import { FilterType } from "../types/IFilterType";

export default function generateQuickSearchFilter(quickSearchFilter: Omit<IFieldPath, "displayName" | "sortable">[], value: string) {
  function getItemByField(fieldPath: Omit<IFieldPath, "displayName" | "sortable">): FilterType {
    if (!fieldPath.child) {
      return { [fieldPath.apiField + "_contains"]: value };
      //return { [fieldPath.apiField]: { contains: value } }
    }
    else {
      const child: any = getItemByField(fieldPath.child)
      return { [fieldPath.apiField]: { or: [...child] } };
    }

  }
  const items = quickSearchFilter.map((f) => getItemByField(f));
  const filterQuery = { or: [...items] }
  return filterQuery;
}
