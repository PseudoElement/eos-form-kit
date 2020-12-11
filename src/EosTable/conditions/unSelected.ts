import { IHandlerProps } from "../types/ITableProvider";

function unSelected({ refApi }: IHandlerProps) {
    const state = refApi.getCurrentTableState()
    if (!state.selectedRowKeys)
        return false
    return state.selectedRowKeys.length === 0
}

export default unSelected