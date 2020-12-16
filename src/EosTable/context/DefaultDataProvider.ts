import { useEosTableComponentsStore } from "../StoreComponents";
import { ITableProvider } from "../types";

export function useDefaultProvider() {
    const {
        fetcConditionFromStore,
        fetchActionFromStore,
        fetchControlFromStore,
    } = useEosTableComponentsStore();  

    // function defaultDataProvider(tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings) {

    //     const query = generateSelectQuery(tableSettings, userSettings);
    //     const filterArray = tableState.filter && Array.from(tableState.filter.values())
    //     const filter = filterArray && { and: [...filterArray] }

    //     return new Promise<ITableData>((resolve, reject) => {
    //         apolloClient.query({
    //             errorPolicy: 'all',
    //             //fetchPolicy: "no-cache",
    //             query: gql`${query}`,
    //             variables: {
    //                 after: tableState.after,
    //                 first: tableState.pageSize,
    //                 orderby: tableState.orderby,
    //                 filter: filter,
    //             }
    //         })
    //             .then((result) => {
    //                 const { data, errors } = result;
    //                 if (errors)
    //                     return reject(errors)
    //                 const returnData = data[Object.keys(data)[0]];
    //                 const tableData: ITableData = {
    //                     records: returnData.items,
    //                     totalCount: returnData.totalCount
    //                 }
    //                 return resolve(tableData)
    //             })
    //             .catch((errors) => reject(errors));
    //     })
    // }

    const DefaultTableProvider: ITableProvider = {
        fetchAction: fetchActionFromStore,
        fetchCondition: fetcConditionFromStore,
        fetchRender: fetchControlFromStore
    };

    return { DefaultTableProvider };
}
