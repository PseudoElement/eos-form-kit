import { ITableState } from "../types";
import { IHandlerProps } from "../types/ITableProvider";

function unSelected({ refApi }: IHandlerProps) {
    const state = refApi.getCurrentTableState() as ITableState
    return (state.selectedRowKeys?.length === 0) && !state.currentRowKey
}

export default unSelected