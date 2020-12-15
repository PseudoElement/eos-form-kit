import { ITableSettings, ITableState, ITableUserSettings } from "../types";
import { IPreparedQuery } from "../types/IPreparedQuery";
import generateSelectQuery from "./generateSelectQuery";

function generatePreparedQuery(tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean): IPreparedQuery {
    const query = generateSelectQuery(tableSettings, userSettings, onlyKeysForSelectedAll);
    const filterArray = tableState.filter && Array.from(tableState.filter.values())
    const filter = filterArray && { and: [...filterArray] }
    tableSettings.requiredFilter && filter?.and.push(tableSettings.requiredFilter)

    return {
        query,
        variables: {
            after: tableState.after,
            first: tableState.pageSize,
            orderby: tableState.orderby,
            filter: filter,
        }
    }
}

export { generatePreparedQuery }