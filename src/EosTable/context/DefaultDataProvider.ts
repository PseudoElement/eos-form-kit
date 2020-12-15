//import { gql, useApolloClient } from "@apollo/react-hooks";
//import { generateGridMenu } from "../helpers/generateMenu";
//import { GenerateRightMenu } from "../helpers/generateRightMenu";
//import generateSelectQuery from "../helpers/generateSelectQuery";
//import { getColumnsBySettings } from "../helpers/getColumnsBySettings";
import { useEosTableComponentsStore } from "../StoreComponents";
//import { IColumn } from "../types/IColumn";
//import { ITableApi } from "../types/ITableApi";
//import { ITableData } from "../types/ITableData";
import { ITableProvider } from "../types/ITableProvider";
//import { ITableSettings } from "../types/ITableSettings";
//import { ITableState } from "../types/ITableState";
//import { ITableUserSettings } from "../types/ITableUserSettings";

export function useDefaultProvider() {
    //const apolloClient = useApolloClient();
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
    //                 first: tableState.first,
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
        //fetchData: defaultDataProvider
    };

    return { DefaultTableProvider };
}
