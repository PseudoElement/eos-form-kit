import { Table } from '@eos/rc-controls'
import { PaginationProps } from '@eos/rc-controls/lib/pagination'
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import GenMenuItems from '../components/GenMenuItems'
import { compareArrays, compareMaps } from '../helpers/compareObjects'
import { GenerateRightMenu } from '../helpers/generateRightMenu'
import { getPossibleSortings, setDirectionToSortPath } from '../helpers/generateSorter'
import { getColumnsBySettings } from '../helpers/getColumnsBySettings'
import { getRecordsByKeys, getRowKey } from '../helpers/getRowKey'
import { E_KEY_CODE } from '../types/EnumTypes'
import { IColumn } from '../types/IColumn'
import { FilterType } from '../types/IFilterType'
import { ISorterPath } from '../types/ISorterType'
import { ITableApi } from '../types/ITableApi'
import { ITableProvider } from '../types/ITableProvider'
import { ITableSettings } from '../types/ITableSettings'
import { ITableState } from '../types/ITableState'
import { IColumnUserSettings, ITableUserSettings } from '../types/ITableUserSettings'

interface ITableGenProps {
    tableSettings: ITableSettings
    tableUserSetiings: ITableUserSettings
    initTableState?: ITableState
    provider: Omit<ITableProvider, "tableSettingLoad" | "tableUserSettingLoad">
}

const EosTableGen = React.forwardRef<any, ITableGenProps>(({ tableSettings,
    tableUserSetiings,
    initTableState,
    provider: {
        fetchData,
        triggers,
        fetchRender,
        fetchAction,
        fetchCondition,
        localize,
        saveUserSetting,
        disableSelectRecord
    }
}: ITableGenProps, ref) => {

    //#region ref
    const currentRef = (ref ?? useRef<ITableApi>()) as React.MutableRefObject<ITableApi>;
    useImperativeHandle(currentRef, (): ITableApi => {
        const api: ITableApi = {
            setTableState: setTableState,           
            getCurrentTableState: () => { return { ...currentTableState } },
            getTableSetting: () => { return { ...tableSettings } },
            getUSerSetting: () => { return { ...tableUserSetiings } }
        }
        return api;
    });
    //#endregion    

    const DEFAULT_PAGE_SIZE = 10
    const DEFAULT_CURRENT_PAGE = 1

    const initState: ITableState = useMemo(() => {
        const init: ITableState =
        {
            orderby: initTableState?.orderby || tableUserSetiings.defaultSort,
            maxSelectedRecords: initTableState?.maxSelectedRecords || tableSettings.maxSelectedRecords,
            minSelectedRecords: initTableState?.minSelectedRecords || tableSettings.minSelectedRecords,
            pageSize: initTableState?.pageSize || tableUserSetiings.pageSize || DEFAULT_PAGE_SIZE,
            currentPage: initTableState?.currentPage || DEFAULT_CURRENT_PAGE,
            selectedRowKeys: initTableState?.selectedRowKeys || [],
            selectedRecords: initTableState?.selectedRecords || [],
            filter: initTableState?.filter || tableUserSetiings.defaultFilters
        }
        return init
    }, [initTableState, tableUserSetiings, tableSettings])

    //#region private functions
    const rowKeyValue = (record: any) => {
        return getRowKey(record, tableSettings.keyFields)
    }
    const getValueByKey = (keyValues: string[]) => {
        return getRecordsByKeys(tableData, keyValues, tableSettings.keyFields)
    }
    const afterRecords = (page: number, pageSize: number) => {
        return (page - 1) * pageSize - 1;
    }

    const selectRecordsAndKeys = (selected: boolean, rowKeyVaulues?: string[], recordValues?: any[]) => {
        let keyValues: string[] | undefined = undefined
        if (rowKeyVaulues) {
            keyValues = rowKeyVaulues
        }
        if (recordValues) {
            keyValues = recordValues.map((item: any) => rowKeyValue(item));
        }
        if (keyValues) {
            let rowKeys: string[] = []
            let resultRowKeys: string[] = []
            if (maxSelectedRecords
                && maxSelectedRecords !== 0) {
                if (keyValues.length > maxSelectedRecords) {
                    rowKeys = keyValues.splice(keyValues.length - maxSelectedRecords)
                }
                else {
                    rowKeys = keyValues
                }
                const remainder = maxSelectedRecords - rowKeys.length
                resultRowKeys = selectedRowKeys.filter(elem => !rowKeys.some(key => key === elem))
                if (resultRowKeys.length > remainder) {
                    resultRowKeys = resultRowKeys.splice(resultRowKeys.length - remainder)
                }
            }
            else {
                rowKeys = keyValues
                resultRowKeys = selectedRowKeys.filter(elem => !rowKeys.some(key => key === elem))
            }

            const arrayRecords = selectedRecords.filter(record => resultRowKeys.some(key => key === rowKeyValue(record)))
            if (selected) {
                resultRowKeys.push(...rowKeys)
                arrayRecords.push(...getValueByKey(rowKeys))
                return { selRowKeys: resultRowKeys, selRecords: arrayRecords, unSelRecords: [] }
            }
            else {
                return { selRowKeys: resultRowKeys, selRecords: arrayRecords, unSelRecords: getValueByKey(rowKeys) }
            }
        }

        return { selRowKeys: [], selRecords: [], unSelRecords: [] }
    }

    const setSelectRecordsAndKeys = (selected: boolean, rowKeys?: string[], records?: any[]) => {
        const { selRecords, selRowKeys, unSelRecords } = selectRecordsAndKeys(selected, rowKeys, records)
        setSelectedRowKeys(selRowKeys)
        setSelectedRecords(selRecords)
        const state: ITableState = { ...currentTableState, selectedRecords: selRecords, selectedRowKeys: selRowKeys, lastUnSelectedRecords: unSelRecords }
        triggers?.onChangeSelectedRows && triggers.onChangeSelectedRows({ tableApi: currentRef.current, tableSetting: tableSettings, userSetting: tableUserSetiings, tableState: state })
    }
    //#endregion

    const [tableState, setTableState] = useState<ITableState>(() => initState)
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [lastSelectedRowKey, setLastSelectedRowKey] = useState<string>()
    const [currentRowKey, setCurrentRowKey] = useState<string | undefined>(undefined)
    const [currentRecord, setCurrentRecord] = useState<any | undefined>(undefined)

    const [possibleSorting] = useState(() => getPossibleSortings(tableSettings, localize))
    const [columns, setColumns] = useState<IColumn[]>(() => getColumnsBySettings(tableSettings, tableUserSetiings.columns, fetchRender, localize));
    const [sorterList, setSorterList] = useState<ISorterPath[] | undefined>(() => initState.orderby);
    const [queryFilters, setQueryFilters] = useState<Map<string, FilterType>>(() => initState.filter || new Map());
    const [queryAfter, setQueryAfter] = useState(() => afterRecords(initState.currentPage || DEFAULT_CURRENT_PAGE, initState.pageSize || DEFAULT_PAGE_SIZE));
    const [pageSize, setPageSize] = useState<number>(() => initState.pageSize || DEFAULT_PAGE_SIZE);

    const [tableData, setTableData] = useState<any[]>([]);
    const [recordsTotalCount, setRecordsTotalCount] = useState<number>(0);
    const [menu, setMenu] = useState<JSX.Element[]>([]);
    const [rightMenu, setRightMenu] = useState<JSX.Element>();
    const [isLoading, setIsLoading] = useState(false);

    //const [showSelNodes, setShowSelNodes] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => initState.currentPage || DEFAULT_CURRENT_PAGE)

    const [maxSelectedRecords, setMaxSelectedRecords] = useState<number | undefined>(() => initState.maxSelectedRecords)
    const [minSelectedRecords, setMinSelectedRecords] = useState<number | undefined>(() => initState.minSelectedRecords)

    const [quickSearchMode, setQuickSearchMode] = useState(() => initState.quickSearchMode)

    const currentTableState: ITableState = {
        after: queryAfter,
        filter: new Map(queryFilters),
        orderby: sorterList && [...sorterList],
        selectedRecords: [...selectedRecords],
        selectedRowKeys: [...selectedRowKeys],
        tableData: [...tableData],
        currentPage: currentPage,
        pageSize: pageSize,
        maxSelectedRecords: maxSelectedRecords,
        currentRowKey: currentRowKey,
        currentRecord: currentRecord,
        quickSearchMode: quickSearchMode
    }

    useEffect(() => {
        getTableData()
    }, [fetchData, queryAfter, sorterList, queryFilters, pageSize, currentPage])

    useEffect(() => {
        tableSettings.menu && setMenu(
            GenMenuItems({
                fetchAction: fetchAction,
                fetchCondition: fetchCondition,
                fetchControl: fetchRender,
                menuItems: tableSettings.menu,
                refApi: currentRef.current
            }))

        setRightMenu(<GenerateRightMenu tableSettings={tableSettings} refApi={currentRef.current} fetchAction={fetchAction} fetchCondition={fetchCondition} fetchControl={fetchRender} />)
    }, [selectedRowKeys, currentRowKey, queryFilters])

    useEffect(() => {        
        setRightMenu(<GenerateRightMenu tableSettings={tableSettings} refApi={currentRef.current} fetchAction={fetchAction} fetchCondition={fetchCondition} fetchControl={fetchRender} />)
    }, [quickSearchMode])

    useEffect(() => {
        let isUpdate = false
        if (!compareMaps(queryFilters, tableState.filter || new Map())) {
            setQueryFilters(() => tableState.filter ? new Map(tableState.filter) : new Map())
            isUpdate = true
        }
        if (tableState.pageSize !== pageSize) {
            setPageSize(tableState.pageSize || DEFAULT_PAGE_SIZE)
            isUpdate = true
        }
        if (!compareArrays(tableState.selectedRowKeys, selectedRowKeys)) {
            setSelectedRowKeys(tableState.selectedRowKeys || [])
            const selRecords = (tableState.selectedRowKeys && (
                (
                    tableState.selectedRecords && getRecordsByKeys(tableState.selectedRecords, tableState.selectedRowKeys, tableSettings.keyFields)
                ) ||
                (
                    tableData && getRecordsByKeys(tableData, tableState.selectedRowKeys, tableSettings.keyFields)
                ))) || []
            setSelectedRecords(selRecords)
        }
        if (!compareArrays(tableState.orderby, sorterList)) {
            setSorterList(tableState.orderby || [])
            isUpdate = true
        }
        if (tableState.currentPage !== currentPage) {
            setCurrentPage(tableState.currentPage || DEFAULT_CURRENT_PAGE)
            setQueryAfter(afterRecords(tableState.currentPage || DEFAULT_CURRENT_PAGE, tableState.pageSize || DEFAULT_PAGE_SIZE))
            isUpdate = true
        }

        setMaxSelectedRecords(tableState.maxSelectedRecords)
        setMinSelectedRecords(tableState.minSelectedRecords)
        setQuickSearchMode(tableState.quickSearchMode)

        if (tableState.currentRowKey !== currentRowKey) {
            setCurrentRowKey(tableState.currentRowKey?.toString())
            const record = tableState.currentRowKey && getValueByKey([tableState.currentRowKey.toString()])[0]
            setCurrentRecord(record)
        }
        tableState.forcedReloadData && !isUpdate && getTableData()
    }, [tableState])

    useEffect(() => {
        !isLoading && tableData && triggers?.onUpdateState && triggers.onUpdateState(currentTableState)
    }, [currentRowKey, selectedRowKeys, pageSize, currentPage, tableData, queryFilters, sorterList, maxSelectedRecords, isLoading, minSelectedRecords])


    useEffect(() => {
        const saveSetting = () => {
            const tableColumnsSetting = columns.map(column => {
                const tableColumnSetting: IColumnUserSettings = {
                    name: column.key,
                    fixed: column.fixed,
                    width: column.width,
                    visible: true
                }
                return tableColumnSetting
            })

            const savedSetting: ITableUserSettings = {
                ...tableUserSetiings,
                pageSize: pageSize,
                columns: [...tableColumnsSetting],
                defaultSort: sorterList
            }
            saveUserSetting && saveUserSetting(savedSetting)
        }
        const timeout = setTimeout(saveSetting, 10000)
        return () => {
            clearTimeout(timeout);
        }
    }, [columns])

    const getTableData = async () => {
        if (fetchData) {
            setIsLoading(true);
            fetchData(currentTableState, tableSettings, tableUserSetiings)
                .then(({ records, totalCount }) => {
                    setRecordsTotalCount(totalCount);
                    setTableData(records)
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsLoading(false);
                })
        }
    };

    //#region pagination
    const handlePaginationChange = (page: number, paginationPageSize: any) => {
        const afterNumber = afterRecords(page, paginationPageSize);
        setQueryAfter(afterNumber);
        setPageSize(paginationPageSize);
        setCurrentPage(page)
        const state: ITableState = { ...currentTableState, after: afterNumber, pageSize: paginationPageSize, currentPage: page }
        triggers?.onPaginationChange && triggers.onPaginationChange({ tableApi: currentRef.current, tableSetting: tableSettings, userSetting: tableUserSetiings, tableState: state })
    }

    const pagination: PaginationProps = {
        total: recordsTotalCount,
        pageSize: pageSize,
        showMoreBtn: false,//tableDataTotalCount > tableVisibleCount,
        pageSizeOptions: tableSettings.visual?.pageSizeOptions,
        current: currentPage,
        onChange: handlePaginationChange
    }
    //#endregion

    //#region rowSelection 
    const onSelect = (record: any, selected: any) => {
        setSelectRecordsAndKeys(selected, undefined, [record])
    };

    const onSelectAllOnPage = (select: any, _data: any, elems: any[]) => {
        (!maxSelectedRecords || maxSelectedRecords === 0 || elems.length <= maxSelectedRecords) && setSelectRecordsAndKeys(select, undefined, elems)
    };

    const rowSelection: any = {
        selectedRowKeys: selectedRowKeys,
        onSelectedRowKeys: setSelectedRowKeys,
        lastSelectedRowKey: lastSelectedRowKey,
        onLastSelectedRowKey: setLastSelectedRowKey,
        onSelect: onSelect,
        onSelectAll: onSelectAllOnPage,
        getCheckboxProps: (record: any) => ({
            disabled: disableSelectRecord && disableSelectRecord(record),
        }),
    };
    //#endregion

    const onTableChange = (_pagination: any, _filters: any, sorter: any) => {
        const queryOrderby: any[] = [];
        if (Array.isArray(sorter)) {
            sorter.forEach((s: any) => {
                if (s.order) {
                    const order = s.order === 'ascend' ? "Asc" : "Desc"
                    const sortPaths = possibleSorting.list.filter(ps => ps.sorterPath && ps.columnName === s.field).map(ps => {
                        return setDirectionToSortPath(ps.sorterPath as ISorterPath, order)
                    })
                    queryOrderby.push(...sortPaths)
                }
            })
        }
        else {
            if (sorter.order) {
                const order = sorter.order === 'ascend' ? "Asc" : "Desc"
                const sortPaths = possibleSorting.list.filter(ps => ps.sorterPath && ps.columnName === sorter.field).map(ps => {
                    return setDirectionToSortPath(ps.sorterPath as ISorterPath, order)
                })
                queryOrderby.push(...sortPaths)
            }
        }
        setSorterList(queryOrderby)
    };

    //#region resize, drop, fixed

    const onResizableHandler = (col: any, width: number) => {
        if (width > 20) {
            const index = columns.findIndex(item => item.key === col.key);
            const newColumns = [...columns];
            newColumns[index] = {
                ...columns[index],
                width: width
            };
            setColumns(newColumns);
        }
    }

    const onDropHandler = (_element: any, startIndex: any, lastIndex: any) => {
        const newColumns = [...columns];
        newColumns[startIndex] = columns[lastIndex];
        newColumns[lastIndex] = columns[startIndex];
        setColumns(newColumns);
    }

    const onFixedColumnClick = (fixedKeys: any) => {
        const newColumns = columns.map((item) => {
            if (fixedKeys.includes(item.key)) return {
                ...item,
                fixed: true
            };
            return {
                ...item,
                fixed: false
            };
        });
        setColumns([...newColumns]);
    }
    //#endregion

    //#region Memo Settings
    const bordered = useMemo(() => {
        return tableSettings.visual?.bordered ? tableSettings.visual.bordered : (tableSettings.visual?.resizable ? "header" : undefined)
    }, [tableSettings.visual])

    const isDifferentRow = useMemo(() => {
        return tableSettings.visual?.isDifferentRow
    }, [tableSettings.visual])

    const scroll = useMemo(() => { return { x: "max-content", y: "100%" } }, [])
    //#endregion

    const onChangeCurrentRowKey = (rowKey: string) => {
        if (rowKey) {
            const record = getValueByKey([rowKey])[0]
            setCurrentRowKey(rowKey)
            setCurrentRecord(record)
            const state: ITableState = { ...currentTableState, currentRecord: record, currentRowKey: rowKey }
            triggers?.onRowClick && triggers.onRowClick({ tableApi: currentRef.current, tableSetting: tableSettings, userSetting: tableUserSetiings, tableState: state })
        }
        else {
            setCurrentRowKey(undefined)
            setCurrentRecord(undefined)
        }
    };

    //#region checkboxMenu
    const selectAllOnPage: any = (keys: any) => {
        (!maxSelectedRecords || maxSelectedRecords === 0 || keys.length <= maxSelectedRecords) && setSelectRecordsAndKeys(true, keys)
    };

    const selectAll = () => {
        (!maxSelectedRecords || maxSelectedRecords === 0) && fetchData && fetchData(currentTableState, tableSettings, tableUserSetiings, true)
            .then(({ records }) => {
                setSelectRecordsAndKeys(true, undefined, records)
            })
            .catch((error) => console.error(error))
    };

    const cancelAllOnPage: any = (keys: any) => {
        setSelectRecordsAndKeys(false, keys)
    };

    const cancelAll = () => {
        setSelectRecordsAndKeys(false)
    };
    //#endregion    

    function onRowDoubleClick(record: any) {
        const state: ITableState = { ...currentTableState, currentRecord: record, currentRowKey: rowKeyValue(record) }
        triggers?.onRowDoubleClick && triggers.onRowDoubleClick({ tableApi: currentRef.current, tableSetting: tableSettings, userSetting: tableUserSetiings, tableState: state })
    }

    const onPageDown = (altKey: boolean) => {
        if (currentPage >= recordsTotalCount / pageSize) return;
        const newCurrentPage = altKey ? Math.ceil(recordsTotalCount / pageSize) : currentPage + 1
        setCurrentPage(newCurrentPage);
        setQueryAfter(afterRecords(newCurrentPage, pageSize))
    };

    const onPageUp = (altKey: boolean) => {
        if (currentPage <= 1) return
        const newCurrentPage = altKey ? 1 : currentPage - 1
        setCurrentPage(newCurrentPage);
        setQueryAfter(afterRecords(newCurrentPage, pageSize))
    };


    const table = (
        <Table.Menu
            gutter="75px"
            rowCount={recordsTotalCount}
            selectedRowCount={selectedRowKeys.length}
            submenu={rightMenu}
            menu={menu}
        >
            <Table
                isVirtualTable
                fullHeight
                scroll={scroll}
                columns={columns}
                dataSource={tableData}
                isDifferentRow={isDifferentRow}
                ellipsisRows={tableSettings.visual?.ellipsisRows}
                loading={isLoading}
                onChange={onTableChange}
                currentRowKey={currentRowKey}
                onChangeCurrentRowKey={onChangeCurrentRowKey}
                pagination={pagination}
                rowKey={rowKeyValue}
                rowSelection={rowSelection}
                settings={{
                    isDraggable: true,
                    onDrop: tableSettings.visual?.dragable ? onDropHandler : undefined,
                    onResizable: tableSettings.visual?.resizable ? onResizableHandler : undefined
                }}
                onFixedColumnClick={tableSettings.visual?.fixedColumn ? onFixedColumnClick : undefined}
                bordered={bordered}
                //deleteLastColumnWidth={tableSettings.visual?.resizable && tableSettings.visual?.dragable}
                checkboxMenu={
                    {
                        cancelAll: cancelAll,
                        cancelAllOnPage: cancelAllOnPage,
                        selectAll: selectAll,
                        selectAllOnPage: selectAllOnPage

                    }
                }
                onRow={(record) => {
                    return {
                        onDoubleClick: (event) => {
                            event.target["type"] !== "checkbox" && onRowDoubleClick(record)
                        },
                        onKeyDown: (e) => {
                            switch (e.key) {
                                case E_KEY_CODE.ALT:
                                    return;
                                case E_KEY_CODE.SPACE:
                                    e.preventDefault();
                                    if (currentRowKey) {
                                        const selected = !selectedRowKeys.includes(currentRowKey)
                                        setSelectRecordsAndKeys(selected, [currentRowKey])
                                    }
                                case E_KEY_CODE.PAGE_UP:
                                    e.preventDefault()
                                    onPageUp(e.altKey)
                                    return

                                case E_KEY_CODE.PAGE_DOWN:
                                    e.preventDefault()
                                    onPageDown(e.altKey)
                                    return;

                                case E_KEY_CODE.ENTER:
                                    e.preventDefault();
                                    onRowDoubleClick(record)
                                    return
                            }
                        },
                    }
                }}
            >
            </Table>
        </Table.Menu>

    )

    return useMemo(() => table, [columns, tableData, isLoading, menu, rightMenu])
})

export default EosTableGen