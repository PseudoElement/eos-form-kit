import { CheckableButton, DirectoryBookIcon, FolderIcon, SearchButton } from '@eos/rc-controls'

import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import generateQuickSearchFilter from '../../EosTable/helpers/generateQuickSearchFilter'
import { FilterType, IControlRenderProps, ITableApi, ITableState } from '../../EosTable/types'



export default function QuickSearchForTable({ refApi, renderArgs }: IControlRenderProps) {
    const classifMode = renderArgs && renderArgs.mode && renderArgs.mode === "classif"
    const refTableApi = refApi as ITableApi
    if (!refTableApi)
        return <Fragment />
    const state = refTableApi.getCurrentTableState()
    const tableSettings = refTableApi.getTableSetting()

    const [show, setShow] = useState<boolean | { mode: string } | undefined>(() => state.quickSearchMode)
    const [searchInCurrent, setSearchInCurrent] = useState<boolean>(false)
    const [searchInAll, setSearchInAll] = useState<boolean>(false)

    const setTableState = (value?: string) => {
        if (tableSettings.quickSearchFilter) {
            const filters = state.filter ? new Map(state.filter) : new Map<string, FilterType>()
            let quickSearchMode: any
            if (value) {
                quickSearchMode = (searchInCurrent && { mode: "searchInCurrent" }) || (searchInAll && { mode: "searchInAll" }) || true
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
            if (!state.quickSearchMode) {
                setSearchInCurrent(false)
                setSearchInAll(false)
            }
        }
    }, [state.quickSearchMode])

    return <SearchButton
        show={show && true}
        onClick={onClick}
        width={300}
        input={{
            allowClear: true,
            onPressEnter: (e) => {
                setTableState(e.currentTarget.value)
            },

        }}
        directoryItems={ classifMode &&
            <div>
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <CheckableButton checked={searchInAll} onChange={(checked) => {
                        if (checked) {
                            setSearchInAll(true)
                            setSearchInCurrent(false)
                        }
                        else {
                            setSearchInAll(false)
                        }
                    }}>
                        <DirectoryBookIcon /><span style={{ marginLeft: "8px" }}>Искать во всем справочнике</span>
                    </CheckableButton>

                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <CheckableButton checked={searchInCurrent} onChange={(checked) => {
                        if (checked) {
                            setSearchInCurrent(true)
                            setSearchInAll(false)
                        }
                        else {
                            setSearchInCurrent(false)
                        }
                    }}>
                        <FolderIcon /><span style={{ marginLeft: "8px" }}>Искать в текущей папке</span>
                    </CheckableButton>
                </div>
            </div>} />
}
