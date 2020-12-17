import { ITableSettings, ITableState, ITableUserSettings } from "../types";
import { IPreparedQuery } from "../types/IPreparedQuery";
import generateSelectQuery from "./generateSelectQuery";

function generatePreparedQuery(tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean): IPreparedQuery {
    const query = generateSelectQuery(tableSettings, userSettings, onlyKeysForSelectedAll);
    const filterArray = tableState.filter && Array.from(tableState.filter.values())
    let filter = filterArray && { and: [...filterArray] }

    if (tableSettings.requiredFilter) {
        if (filter) {
            filter.and?.push(tableSettings.requiredFilter)
        }
        else {
            filter = { and: [tableSettings.requiredFilter] }
        }
    }

    const after = onlyKeysForSelectedAll ? -1 : tableState.after
    const first = onlyKeysForSelectedAll ? 1000000 : tableState.pageSize
    const orderby = onlyKeysForSelectedAll ? undefined : tableState.orderby

    return {
        query,
        variables: {
            after: after,
            first: first,
            orderby: orderby,
            filter: filter,
        }
    }
}

export { generatePreparedQuery }

