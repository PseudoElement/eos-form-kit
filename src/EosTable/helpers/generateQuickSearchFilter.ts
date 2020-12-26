import { IFieldPathShort } from "../types/IFieldPath";
import { FilterExpressionFragment } from "../types/IFilterType";

export function generateQuickSearchFilterFragment_OldStyle(quickSearchFilter: IFieldPathShort[], value?: string) {
  if (!value)
    return undefined

  function getItemByField(fieldPath: IFieldPathShort): FilterExpressionFragment {
    if (!fieldPath.child) {
      return { [fieldPath.apiField + "_contains"]: value };
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

export function generateQuickSearchFilterFragment(quickSearchFilter: IFieldPathShort[], value?: string) {
  if (!value)
    return undefined

  function getItemByField(fieldPath: IFieldPathShort): FilterExpressionFragment {
    if (!fieldPath.child) {
      return { [fieldPath.apiField]: { contains: { value: value } } }
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

