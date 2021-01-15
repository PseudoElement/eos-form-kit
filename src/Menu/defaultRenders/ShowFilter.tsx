import { CheckableWrapper, CloseIcon, FilterIcon } from '@eos/rc-controls'

import React, { useEffect, useState } from 'react'
import { IControlRenderProps, ITableApi, ITableState } from '../../EosTable/types'


export default function ShowFilter({ refApi }: IControlRenderProps) {
    const tableApi = refApi as ITableApi
    const currentTableState = tableApi.getCurrentTableState()
    const [showFilter, setShowFilter] = useState<boolean | undefined>(() => currentTableState.showFormFilter)

    useEffect(() => {
        setShowFilter(currentTableState.showFormFilter)
    }, [currentTableState.showFormFilter])

    useEffect(() => {
        if (currentTableState.showFormFilter !== showFilter) {
            const newState: ITableState = { ...currentTableState, showFormFilter: showFilter }
            tableApi.setTableState(newState)
        }
    }, [showFilter])

    const closeFilter = () => {
        const newState: ITableState = { ...currentTableState, showFormFilter: false, formFilterMode: false, filterValueObjects: { ...currentTableState.filterValueObjects, formFilter: undefined } }
        tableApi.setTableState(newState)
    }    

    return <CheckableWrapper selected={showFilter} parametreApplied={currentTableState.formFilterMode} onSelected={() => setShowFilter(!showFilter)} type="secondary" leftContent={<CloseIcon onClick={closeFilter} />}>
        <FilterIcon />
    </CheckableWrapper>
}
