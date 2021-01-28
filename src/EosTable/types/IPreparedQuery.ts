import { FilterExpressionFragment } from ".";
import { ISorterPath } from "./ISorterType";

export interface IPreparedQuery {
    query: string,
    variables: {
        after: string | number | undefined,
        first: number | undefined,
        orderby: ISorterPath[] | undefined
        filter: FilterExpressionFragment | undefined
    }
}