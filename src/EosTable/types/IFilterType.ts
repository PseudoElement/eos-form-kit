export type FilterType = FilterUnion | { [key: string]: FilteGroupExpression | FilterExpression | FilterValue }

type FilterUnion = { [K in FilterUnionKeys]?: FilterType[] }
type FilteGroupExpression = { [K in FilterExpressionWithGroupsKeys]?: FilterType | FilteGroupExpression | FilterValue }
type FilterExpression = { [K in FilterExpressionKeys]?: FilterValue }

type FilterExpressionWithGroupsKeys = FilterGroupExpressionKeys | FilterExpressionKeys
type FilterGroupExpressionKeys = "matches" | "any" | "none" | "all" | "count"
type FilterUnionKeys = "and" | "or"
type FilterExpressionKeys = "equal" | "in" | "startsWith" | "endsWith" | "contains"
    | "notEqual" | "notIn" | "notStartsWith" | "notEndsWith" | "notContains" | "isNull"
    | "greater" | "greaterOrEqual" | "less" | "lessOrEqual" | "not"

type FilterValue = string | number | boolean | string[] | number[]