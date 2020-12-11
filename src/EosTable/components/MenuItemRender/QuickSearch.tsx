import { SearchButton } from '@eos/rc-controls'

import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import generateQuickSearchFilter from '../../helpers/generateQuickSearchFilter'
import { FilterType, ITableState } from '../../types'
import { IControlRenderProps } from '../../types/IControlRenderProps'


export default function QuickSearch({ refApi }: IControlRenderProps) {
    if (!refApi)
        return <Fragment />
    const state = refApi.getCurrentTableState()
    const tableSettings = refApi.getTableSetting()

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
            refApi.setTableState(tableState)
        }
    }

    const onClick = (isOpen: boolean) => {
        if (isOpen) {
            const tableState: ITableState = {
                ...state,
                quickSearchMode: true
            }
            refApi.setTableState(tableState)
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