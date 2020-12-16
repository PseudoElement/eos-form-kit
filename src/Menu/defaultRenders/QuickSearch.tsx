import { SearchButton } from '@eos/rc-controls'

import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import generateQuickSearchFilter from '../../EosTable/helpers/generateQuickSearchFilter'
import { FilterType, IControlRenderProps, ITableApi, ITableState } from '../../EosTable/types'



export default function QuickSearch({ refApi }: IControlRenderProps) {
    const refTableApi = refApi?.current as ITableApi
    if (!refTableApi)
        return <Fragment />
    const state = refTableApi.getCurrentTableState()
    const tableSettings = refTableApi.getTableSetting()

    const [show, setShow] = useState<boolean | undefined>(() => state.quickSearchMode)

    const setTableState = (value?: string) => {
        if (tableSettings.quickSearchFilter) {
            const filters = state.filter ? new Map(state.filter) : new Map<string, FilterType>()
            let quickSearchMode = true
            if (value) {
                filters.set("QuickSearch", generateQuickSearchFilter(tableSettings.quickSearchFilter, value))
            }
            else {
                if (filters.has("QuickSearch")) {
                    filters.delete("QuickSearch")
                }
                quickSearchMode = false
            }
            const tableState: ITableState = {
                ...state,
                filter: filters,
                quickSearchMode: quickSearchMode
            }
            refTableApi.setTableState(tableState)
        }
    }

    const onClick = (isOpen: boolean) => {
        if (isOpen) {
            const tableState: ITableState = {
                ...state,
                quickSearchMode: true
            }
            refTableApi.setTableState(tableState)
        }
        else {
            setTableState()
        }
    }

    useEffect(() => {
        if (show || state.quickSearchMode) {
            setShow(state.quickSearchMode)            
        }
    }, [state.quickSearchMode])

    return <SearchButton
        show={show}
        onClick={onClick}
        width={300}
        input={{
            allowClear: true,
            onPressEnter: (e) => {
                setTableState(e.currentTarget.value)
            },

        }} />
}