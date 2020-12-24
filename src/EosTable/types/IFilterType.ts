export type FilterExpressionFragment = FilterUnion | { [key: string]: FilteGroupExpression | FilterExpression | FilterValue | FilterValueEmpty | FilterExpressionFragment }

type FilterUnion = { [K in FilterUnionKeys]?: FilterExpressionFragment[] }
type FilteGroupExpression = { [K in FilterExpressionWithGroupsKeys]?: FilterExpressionFragment | FilteGroupExpression | FilterValue }
type FilterExpression = { [K in FilterExpressionKeys]?: FilterValue }

type FilterExpressionWithGroupsKeys = FilterGroupExpressionKeys | FilterExpressionKeys
type FilterGroupExpressionKeys = "matches" | "any" | "none" | "all" | "count"
type FilterUnionKeys = "and" | "or"
type FilterExpressionKeys = "equal" | "in" | "startsWith" | "endsWith" | "contains"
    | "notEqual" | "notIn" | "notStartsWith" | "notEndsWith" | "notContains" | "isNull"
    | "greater" | "greaterOrEqual" | "less" | "lessOrEqual" | "not"

type FilterValueEmpty = string | number | boolean | string[] | number[]

type FilterValue = { value: FilterValueEmpty }