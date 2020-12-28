import { Table } from '@eos/rc-controls'
import { PaginationProps } from '@eos/rc-controls/lib/pagination'
import React, { Fragment, ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form as SearchForm, IFormApi } from '../../Search/SearchForm'
import { useEosComponentsStore } from '../../Hooks/useEosComponentsStore'
import GenMenuItems from '../components/GenMenuItems'
import { compareArrays, compareMaps, deepEqual } from '../helpers/compareObjects'
import { GenerateRightMenu } from '../helpers/generateRightMenu'
import { getPossibleSortings, setDirectionToSortPath } from '../helpers/generateSorter'
import { getColumnsBySettings } from '../helpers/getColumnsBySettings'
import { getRecordsByKeys, getRowKey } from '../helpers/getRowKey'
import { E_KEY_CODE } from '../types/EnumTypes'
import { IColumn } from '../types/IColumn'
import { FilterExpressionFragment, FilterTypeName } from '../types/IFilterType'
import { ISorterPath } from '../types/ISorterType'
import { ITableApi } from '../types/ITableApi'
import { ITableProvider } from '../types/ITableProvider'
import { ITableSettings } from '../types/ITableSettings'
import { ITableState } from '../types/ITableState'
import { ITableUserColumnGroupSettings, ITableUserSettings, TableUserColumn } from '../types/ITableUserSettings'
import { Store } from 'rc-field-form/lib/interface';
import { IFilterValueObjects } from '../types/IFilterValueObjects'

interface ITableGenProps {
    tableSettings: ITableSettings
    tableUserSetiings: ITableUserSettings
    initTableState?: ITableState
    provider: Omit<ITableProvider, "tableSettingLoad" | "tableUserSettingLoad">
    getResourceText?: (name: string) => string
}

const EosTableGen = React.forwardRef<any, ITableGenProps>(({ tableSettings,
    tableUserSetiings,
    initTableState,
    provider: {
        fetchData,
        triggers,
        saveUserSetting,
        disableSelectRecord,
        searchFormService,
        fetchAction,
        fetchControl,
        fetchCondition,
        transformFilterToExpressionFragment
    },
    getResourceText
}: ITableGenProps, ref) => {

    const { fetchControlFromStore, fetchActionFromStore, fetchConditionFromStore } = useEosComponentsStore()

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
            orderby: initTableState?.orderby ?? tableUserSetiings.defaultSort,
            maxSelectedRecords: initTableState?.maxSelectedRecords ?? tableSettings.maxSelectedRecords,
            minSelectedRecords: initTableState?.minSelectedRecords ?? tableSettings.minSelectedRecords,
            pageSize: initTableState?.pageSize ?? tableUserSetiings.pageSize ?? DEFAULT_PAGE_SIZE,
            currentPage: initTableState?.currentPage ?? DEFAULT_CURRENT_PAGE,
            selectedRowKeys: initTableState?.selectedRowKeys ?? [],
            selectedRecords: initTableState?.selectedRecords ?? [],
            filter: initTableState?.filter,
            filterValueObjects: initTableState?.filterValueObjects ?? tableUserSetiings.defaultFilters,
            showFormFilter: initTableState?.showFormFilter ?? tableUserSetiings.filterVisible,
            tableView: initTableState?.tableView
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

    const [possibleSorting] = useState(() => getPossibleSortings(tableSettings, getResourceText))
    const [columns, setColumns] = useState<IColumn[]>(() => getColumnsBySettings(tableSettings, tableUserSetiings, fetchControl, fetchControlFromStore, getResourceText, tableUserSetiings.ellipsisRows, possibleSorting.list));
    const [sorterList, setSorterList] = useState<ISorterPath[] | undefined>(() => initState.orderby);
    const [queryFilters, setQueryFilters] = useState<Map<string, FilterExpressionFragment>>(() => initState.filter || new Map());
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
    const [showFormFilter, setShowFormFilter] = useState<boolean | undefined>()
    const [formFilterMode, setFormFilterMode] = useState<boolean | undefined>()

    const [filterValueObjects, setFilterValueObjects] = useState<IFilterValueObjects>()
    const [tableView, setTableView] = useState<"default" | "card">()

    const currentTableState: ITableState = {
        after: queryAfter,
        filter: new Map(queryFilters),
        orderby: sorterList && [...sorterList],
        selectedRecords: [...selectedRecords],
        selectedRowKeys: [...selectedRowKeys],
        tableData: [...tableData],
        currentPage,
        pageSize,
        maxSelectedRecords,
        currentRowKey,
        currentRecord,
        quickSearchMode,
        showFormFilter,
        formFilterMode,
        filterValueObjects: { ...filterValueObjects }
    }

    useEffect(() => {
        getTableData()
    }, [fetchData, queryAfter, sorterList, queryFilters, pageSize, currentPage])

    useEffect(() => {
        tableSettings.menu && setMenu(
            GenMenuItems({
                fetchAction,
                fetchCondition,
                fetchControl,
                fetchActionFromStore,
                fetchConditionFromStore,
                fetchControlFromStore,
                menuItems: tableSettings.menu,
                refApi: currentRef.current
            }))

        setRightMenu(<GenerateRightMenu tableSettings={tableSettings} refApi={currentRef.current} fetchAction={fetchAction} fetchCondition={fetchCondition} fetchControl={fetchControl} />)
    }, [selectedRowKeys, currentRowKey, queryFilters])

    useEffect(() => {
        setRightMenu(<GenerateRightMenu tableSettings={tableSettings} refApi={currentRef.current} fetchAction={fetchAction} fetchCondition={fetchCondition} fetchControl={fetchControl} />)
    }, [quickSearchMode, showFormFilter, formFilterMode])

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
        setShowFormFilter(tableState.showFormFilter)
        setTableView(tableState.tableView)

        if (tableState.formFilterMode !== formFilterMode) {
            setFormFilterMode(tableState.formFilterMode)
            !tableState.formFilterMode && searchFormApi.current?.clearFields()
        }

        if (!deepEqual(tableState.filterValueObjects, filterValueObjects)) {
            setFilterValueObjects(tableState.filterValueObjects)
        }

        if (tableState.currentRowKey !== currentRowKey) {
            setCurrentRowKey(tableState.currentRowKey?.toString())
            const record = tableState.currentRowKey && getValueByKey([tableState.currentRowKey.toString()])[0]
            setCurrentRecord(record)
        }
        tableState.forcedReloadData && !isUpdate && getTableData()
    }, [tableState])

    useEffect(() => {
        !isLoading && tableData && triggers?.onUpdateState && triggers.onUpdateState(currentTableState)
    }, [currentRowKey, selectedRowKeys, pageSize, currentPage, tableData, queryFilters, sorterList,
        maxSelectedRecords, isLoading, minSelectedRecords, filterValueObjects?.formFilter, filterValueObjects?.quickSearchFilter, filterValueObjects?.externalFilter,
        showFormFilter, formFilterMode, quickSearchMode])


    useEffect(() => {
        const saveSetting = () => {
            const getTableUserColumnSettings = (columnTable: IColumn[]) => {
                return columnTable.map(column => {
                    const tableColumnSetting: TableUserColumn = {
                        name: column.key,
                        fixed: column.fixed,
                        width: column.width,
                        visible: true
                    }
                    if (column.children) {
                        (tableColumnSetting as ITableUserColumnGroupSettings).columns = getTableUserColumnSettings(column.children)
                    }
                    return tableColumnSetting
                })
            }

            const savedSetting: ITableUserSettings = {
                ...tableUserSetiings,
                pageSize: pageSize,
                columns: getTableUserColumnSettings(columns),
                defaultSort: sorterList
            }
            saveUserSetting && saveUserSetting(savedSetting)
        }
        const timeout = setTimeout(saveSetting, 10000)
        return () => {
            clearTimeout(timeout);
        }
    }, [columns])

    const setFilterFragment = (filterTypeName: FilterTypeName) => {
        const filterFragment = transformFilterToExpressionFragment && transformFilterToExpressionFragment(filterTypeName, currentTableState, tableSettings, tableUserSetiings)
        const newFilters = new Map(queryFilters)
        if (filterFragment) {
            newFilters.set(filterTypeName, filterFragment)
            setQueryFilters(newFilters)
        }
        else {
            if (newFilters.has(filterTypeName)) {
                newFilters.delete(filterTypeName)
                setQueryFilters(newFilters)
            }
        }
    }

    useEffect(() => {
        setFilterFragment("quickSearchFilter")
    }, [filterValueObjects?.quickSearchFilter])

    useEffect(() => {
        setFilterFragment("formFilter")
    }, [filterValueObjects?.formFilter])

    useEffect(() => {
        setFilterFragment("externalFilter")
    }, [filterValueObjects?.externalFilter])

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
        const findParent = (arr: IColumn[], key: any, prevEl: IColumn | null): IColumn | null => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].key === key) return prevEl;

                if (arr[i].children) {
                    return findParent(arr[i].children as IColumn[], key, arr[i]);
                }
            }

            return null;
        };

        const parentEl = findParent(columns, _element.key, null);

        if (parentEl !== null) {
            const updateTreeData = (arr: IColumn[], parentEl: IColumn): IColumn[] => {
                return arr.map(item => {
                    if (item.key === parentEl.key && parentEl.children) {
                        const newArr = parentEl.children.slice();
                        newArr[startIndex] = parentEl.children[lastIndex];
                        newArr[lastIndex] = parentEl.children[startIndex];
                        return {
                            ...item,
                            children: newArr
                        };
                    }

                    if (item.children) {
                        return {
                            ...item,
                            children: updateTreeData(item.children, parentEl)
                        };
                    }

                    return item;
                });
            };

            const newColumns = updateTreeData(columns, parentEl);
            setColumns(newColumns);
        } else {
            const newColumns = columns.slice();
            newColumns[startIndex] = columns[lastIndex];
            newColumns[lastIndex] = columns[startIndex];
            setColumns(newColumns);
        }
    }

    const onDragOverHandler = (e: any, overKey: string, dragKey: string) => {
        const findParent = (arr: IColumn[], key: string, prevEl: IColumn | null): IColumn | null => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].key === key) return prevEl;

                if (arr[i].children) {
                    return findParent(arr[i].children as IColumn[], key, arr[i]);
                }
            }

            return null;
        };

        const parentEl = findParent(columns, dragKey, null);

        if (parentEl !== null && parentEl.children) {
            const keys = parentEl.children.map(item => item.key);

            if (!keys.includes(overKey)) {
                e.dataTransfer.dropEffect = 'none';
            } else {
                e.dataTransfer.dropEffect = 'move';
            }
        } else {
            const keys = columns.map(item => item.key);

            if (!keys.includes(overKey)) {
                e.dataTransfer.dropEffect = 'none';
            } else {
                e.dataTransfer.dropEffect = 'move';
            }
        }
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
        if ((!maxSelectedRecords || maxSelectedRecords === 0) && fetchData) {
            setIsLoading(true)
            fetchData(currentTableState, tableSettings, tableUserSetiings, true)
                .then(({ records }) => {
                    setSelectRecordsAndKeys(true, undefined, records)
                })
                .catch((error) => console.error(error))
                .finally(() => setIsLoading(false))
        }
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

    const onSearchAsync = (values: Store) => {
        return new Promise<void>((resolve) => {
            resolve(
                setFilterValueObjects((prev) => {
                    if (prev?.formFilter !== values) {
                        const newFilterValueObjects: IFilterValueObjects = { ...prev, formFilter: values }
                        return newFilterValueObjects
                    }
                    return prev
                }))
        }).then(() => setFormFilterMode(true))
    }

    const onCloseClick = () => {
        setShowFormFilter(false)
    }

    // const getInitialValuesAsync = () => {
    //     return new Promise<any>((resolve) => {
    //         resolve(filterValueObjects?.formFilter)
    //     })
    // }   

    const table = () => (
        <Table
            table={tableView}
            disableFocusFirstRow
            isVirtualTable={pageSize > 20}
            fullHeight
            deleteLastColumnWidth
            scroll={scroll}
            columns={columns}
            dataSource={tableData}
            isDifferentRow={tableUserSetiings.highlightingRows}
            ellipsisRows={tableUserSetiings.ellipsisRows}
            loading={isLoading}
            onChange={onTableChange}
            currentRowKey={currentRowKey}
            onChangeCurrentRowKey={onChangeCurrentRowKey}
            pagination={pagination}
            rowKey={rowKeyValue}
            rowSelection={minSelectedRecords === 0 ? undefined : rowSelection}
            settings={{
                isDraggable: true,
                onDrop: tableSettings.visual?.dragable ? onDropHandler : undefined,
                onResizable: tableSettings.visual?.resizable ? onResizableHandler : undefined,
                onDragOver: tableSettings.visual?.dragable ? onDragOverHandler : undefined,
            }}
            onFixedColumnClick={tableSettings.visual?.fixedColumn ? onFixedColumnClick : undefined}
            bordered={bordered}
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
        </Table>)

    const tableMenu = useCallback((children: ReactElement) => {
        return (
            <Table.Menu
                gutter="75px"
                rowCount={recordsTotalCount}
                selectedRowCount={selectedRowKeys.length}
                submenu={rightMenu}
                menu={menu}
            >
                {children}
            </Table.Menu>
        )
    }, [recordsTotalCount, selectedRowKeys, rightMenu, menu])

    const tableMemo = useMemo(table, [columns, tableData, isLoading, selectedRowKeys, currentRowKey, tableView])

    const searchFormApi = useRef<IFormApi>()

    return <Fragment>
        {searchFormService && <div style={{ paddingBottom: "10px", display: showFormFilter ? "block" : "none" }}>
            <SearchForm getResourceText={getResourceText} ref={searchFormApi} onCloseClick={onCloseClick} onSearchAsync={onSearchAsync} dataService={searchFormService}></SearchForm>
        </div>}
        {tableMenu(tableMemo)}
    </Fragment>
})
EosTableGen.displayName = "EosTableGen"

export default EosTableGen
