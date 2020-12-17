import { IHandlerProps } from "../types/ITableProvider";

function unSelectedOne({ refApi }: IHandlerProps) {
    const state = refApi.getCurrentTableState()
    if (!state.selectedRowKeys)
        return false
    return state.selectedRowKeys.length !== 1
}

export default unSelectedOne
