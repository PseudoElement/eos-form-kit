import { SearchButton } from '@eos/rc-controls'
import React, { useEffect, useState } from 'react'
import { IControlRenderProps, ITableApi, ITableState } from '../../EosTable/types'

export default function QuickSearch({ refApi }: IControlRenderProps) {
    const refTableApi = refApi as (ITableApi | undefined)    
    const state = refTableApi?.getCurrentTableState()
    const [show, setShow] = useState<boolean | undefined>(() => state?.quickSearchMode)    

    useEffect(() => {
        if (show || state?.quickSearchMode) {
            setShow(state?.quickSearchMode)
        }
    }, [state?.quickSearchMode])    

    const setTableState = (value?: string) => {
        const tableState: ITableState = value ?
            {
                ...state,
                filterValueObjects: { ...state?.filterValueObjects, quickSearchFilter: value }
            }
            :
            {
                ...state,
                filterValueObjects: { ...state?.filterValueObjects, quickSearchFilter: value },
                quickSearchMode: false
            }

        refTableApi?.setTableState(tableState)
    }

    const onClick = (isOpen: boolean) => {
        if (isOpen) {
            const tableState: ITableState = {
                ...state,
                quickSearchMode: true
            }
            refTableApi?.setTableState(tableState)
        }
        else {
            setTableState()
        }
    }

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