import { ITableState } from "../types";
import { IHandlerProps } from "../types/ITableProvider";

function unSelectedOne({ refApi }: IHandlerProps) {
    const state = refApi.getCurrentTableState() as ITableState
    return !(((!state.selectedRowKeys || state.selectedRowKeys.length === 0) && state.currentRowKey) || state.selectedRowKeys?.length === 1)    
}

export default unSelectedOne
