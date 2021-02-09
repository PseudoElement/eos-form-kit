import React, { useEffect, useState, useRef } from 'react';
import { Menu, Table, PlusIcon, BinIcon, Collapse, SmartBadge, message, modalMessage, SmartButton, ReceptionIcon } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { IValue, IColumn, 
    //IOtherValue 
} from "../FieldLookupMulti";
import { ITableModalApi, TableModal } from "./TableModal";;
import { IDataService, 
    //IOptionItem 
} from "./AjaxSelect";
import useHistorySlim from '../../Hooks/useHistorySlim';
export interface ITableMenuTool {
    /**ключ */
    key: string | number;
    /**иконка */
    component?: JSX.Element;
    /**заголовок кнопки */
    title?: string;
    /**событие по клику */
    onClick?: () => void;
    /**спрятать заголовок */
    hiddenTitle?: boolean;
    /**условие для отключения кнопки */
    disabled: (selectedRowKeysLength: number) => boolean;
    /**дочерние кнопки */
    children?: ITableMenuTool[];
    inMoreBlock?: boolean;
    /** индекс элемнта в тулбаре */
    index?: number;
    /** имя иконки */
    icon?: string;
};

export interface IDisplayTable {
    value?: any;
    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    onModalVisible?(): void;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;
    /** Функция для обработки запроса */
    dataService: IDataService;

    type?: any;

    /**Тип отрисовки поля. */
    mode: FormMode;

    /**Отображаемое наименование поля. */
    label?: string;
    /**Имя поля в форме при посте */
    name?: string;
    /**Обязательность поля. */
    required?: boolean | undefined;
    /**Оторажать шапку таблицы*/
    showHeader?: boolean;
    /**Имя столбца по умолчанию */
    defaultColumnLabel: string;
    /**Имя модального окна */
    modalWindowTitle?: string;
    /**Индекс столбца по умолчанию */
    defaultColumnIndex?: number;
    /**Разешить дублирование данных */
    allowDuplication?: boolean;
    /**Спрятать столбец по умолчанию */
    hideDefaultColumn?: boolean;
    /**Текст для тулы добавления строки*/
    addRowToolbarTitle?: string; 
    /**Текст для тулы удаления строк */
    deleteRowsToolbarTitle?: string;
    /**Текст для сообщения при добавлении существующей записи.*/
    addRowToolbarWarning?: string;
    /**Текст для модального окна при удалении записи.*/
    deleteRowsToolbarWarning?: string;
    /**Скрыть подпись тулы удаления строк в тултип.*/
    hiddenDeleteToolTitle?: boolean;
    /**Скрыть подпись тулы добавления строки в тултип.*/
    hiddenAddRowToolTitle?: boolean;
    /**
     * событие при нажатии на кнопку "Добавить".
     * Для работы выбора из справочника необxодимо задать:
     * valueProperty - Значение свойства.
     * keyProperty - Ключ свойства.
     * loadData2Async в dataService.
     * onOpenLookupDialogClick - событие при нажатии на кнопку "Добавить".
     * */ 
    onOpenLookupDialogClick(): void;

    onDataChange?(item?: any): void;

    rules: any;

    otherColumns?: IColumn[];
    /**
     * Значение свойства.
     * Для работы выбора из справочника необxодимо задать:
     * valueProperty - Значение свойства.
     * keyProperty - Ключ свойства.
     * loadData2Async в dataService.
     * onOpenLookupDialogClick - событие при нажатии на кнопку "Добавить".
     * */  
    valueProperty?: string;
    /**
     * Ключ свойства.
     * Для работы выбора из справочника необxодимо задать:
     * valueProperty - Значение свойства.
     * keyProperty - Ключ свойства.
     * loadData2Async в dataService.
     * onOpenLookupDialogClick - событие при нажатии на кнопку "Добавить".
     * */  
    keyProperty?: string;
    /** Дополнительные копки в тулбаре */
    addTools?: ITableMenuTool[];
    /** Событие по двойному клику по записи*/
    onRowDoubleClick?: (selectedRowKey?: number) => void;
}

const DisplayTable = React.forwardRef<any, IDisplayTable>(({
    valueProperty,
    keyProperty,
    name,
    value,
    mode,
    onChange,
    notFoundContent,
    dataService,
    type,
    label,
    required,
    showHeader,
    defaultColumnLabel,
    defaultColumnIndex = 0,
    modalWindowTitle,
    allowDuplication,
    otherColumns,
    hideDefaultColumn,
    addRowToolbarTitle,
    deleteRowsToolbarTitle,
    addRowToolbarWarning,
    deleteRowsToolbarWarning,
    hiddenDeleteToolTitle,
    hiddenAddRowToolTitle,
    onOpenLookupDialogClick,
    addTools,
    onRowDoubleClick
}) => {
    const [dataSource, setDataSource] = useState<object[] | undefined>();
    const formData = useRef(value);

    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [rowFromLookup, setRowFromLookup] = useState<IValue | undefined>();
    const historyState = useHistorySlim().getStateByName("LookupDialogResult");

    const tableModalApi = useRef<ITableModalApi>();

    let defaultColumnSchema: IColumn = {
        "label": defaultColumnLabel,
        "disabled": true,
        "name": "defaultColumn"
    };
    const pagination = {
        showMoreBtn: false,
        pageSizeOptions: undefined,
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    const menu = [
        {
            component: <PlusIcon />,
            title: addRowToolbarTitle || 'Добавить строку',
            disabled: () => isDisplay(),
            onClick: onOpenLookupDialogClick || showModalLookup,
            hiddenTitle: hiddenDeleteToolTitle || false,
            key: addRowToolbarTitle || 'PlusIcon'
        },
        {
            component: <BinIcon />,
            title:  deleteRowsToolbarTitle || 'Удалить строки',
            disabled: () => (isDisplay() || selectedRowKeys.length < 1),
            onClick: deleteRowsToolbarWarning ? showDeleteModalMessage : deleteMultiLookupLookupRows,
            hiddenTitle: hiddenAddRowToolTitle || false,
            key: deleteRowsToolbarTitle || 'BinIcon'
        }
    ];

    useEffect(() => {    
        if (name && historyState && keyProperty && valueProperty && historyState[name]) {
            let historyData = getHistoryStateData(historyState[name]);

            let isInData = formData.current?.find((stateRecord: any) => {
                return historyData.find((historyRecord: any) => {
                   return stateRecord.key === historyRecord[keyProperty];
                })
            });
            
            if(!allowDuplication && isInData)  {
                if (addRowToolbarWarning) {
                    message("warning", addRowToolbarWarning);
                } 
                return;
            }

            let newFormData = [...value, ...historyData];
            formData.current = getInitialValue(newFormData);        
            if (onChange) {
                onChange(getInitialValue(newFormData));
            }
        } 
        else if (keyProperty && valueProperty) {
            if (onChange) {
                onChange(getInitialValue(value));
            }
        }
    }, []);

    useEffect(() => {
        if (rowFromLookup && formData.current) {
            getRowFromLookup(rowFromLookup);
        }
    }, [rowFromLookup]);
    useEffect(() => {
        if (value) {
            setDataSource(getDataSource(value));
            formData.current = value;
        } 
        else {
            setDataSource([]);
            formData.current = []; 
        }
        setSelectedRowKeys([]);
    }, [value]);

    const onRow = (row: any) => {
        return {
            onDoubleClick: onRowDoubleClick ? () => onRowDoubleClick(row?.key) : undefined
        };
    };

    return (
        <div>
            <Collapse key={'1'} expandIconPosition={'right'} ghost bordered={true}  >
                <Collapse.Panel key={'1'} forceRender={true}
                    header={
                        <div style={{ borderBottom: '1px solid #E6E6E6' }}>
                            {(!required || formData.current?.length) ?
                                <SmartBadge count={formData.current?.length} type="text" >{label}</SmartBadge> :
                                <SmartBadge showZero={true} count={0} type="text" badgeColor={"red"}>{label}</SmartBadge>
                            }
                        </div>
                    }>
                    <Table.Menu menu={getMenuItemsList(menu)}
                                gutter="5px"
                                rowCount={formData.current?.length}>
                        <Table
                            fullHeight
                            dataSource={dataSource}
                            columns={getColumns(otherColumns)}
                            rowSelection={rowSelection}
                            showHeader={showHeader}
                            settings={{ isDraggable: false }}
                            pagination={pagination}
                            onRow={onRow}
                        />
                    </Table.Menu>
                    <TableModal
                        modalWindowTitle={modalWindowTitle}
                        mode={mode}
                        type={type}
                        ref={tableModalApi}
                        dataService={dataService}
                        notFoundContent={notFoundContent}
                        onFinish={(row) => setRowFromLookup(row)}
                    />
                </Collapse.Panel>
            </Collapse>
        </div>
    );

    function getRowFromLookup(row: IValue) {
        let values: IValue[] = formData.current ? formData.current : [];
        let isInData = formData.current?.find((e: IValue) => {
            return e.key === row.key;
        });
 
        if(isInData && !allowDuplication)  {
            if (addRowToolbarWarning) {
                message("warning", addRowToolbarWarning);
            } 
            return;
        }
        let newRow: IValue = row;
        // if(dataSource && dataSource[0]?.other) {
        //     const defaultOther = dataSource && dataSource[0].other?.map((e: IOtherValue) => {
        //         return {
        //             name: e.name,
        //             value: ''
        //         }
        //     });
        //     newRow = { key: row.key, value: row.value, other: defaultOther  };
        // } else {
        //     newRow = { key: row.key, value: row.value };  
        // }

        const newValues: IValue[] = [...values, newRow];
        if (dataSource && getDataSource) {
            setDataSource([...dataSource, ...getDataSource([newRow]) ]);
        }
        formData.current = newValues;

        if (onChange && newValues.length === formData.current?.length) {
            onChange(newValues);
        }  
    };
    function isDisplay() {
        return FormMode.display === mode;
    };
    function getMenuItemsList(toolsList: ITableMenuTool[]) {

        if(addTools) {
            addTools.forEach(tool => {
                let newTool =  {
                    component: getComponent(tool?.icon || ""),
                    title: tool?.title,
                    disabled: tool?.disabled,
                    onClick: tool?.onClick,
                    hiddenTitle: tool?.hiddenTitle,
                    key: tool?.key
                }

                if(tool?.index !== undefined) {
                    toolsList = [...toolsList.slice(0, tool?.index),
                                newTool, 
                                ...toolsList.slice(tool?.index)];
                }
                else {
                    toolsList = [...toolsList, newTool];
                }
             });
        }
        return (
            toolsList.map(({ component, onClick, disabled, title, children, key, hiddenTitle, inMoreBlock }) => {
                if (children) return (
                    <Menu.SubMenu
                        icon={component}
                        morePanelElement={inMoreBlock}
                        title={hiddenTitle ? title : undefined}
                        key={key}
                        disabled={disabled(selectedRowKeys.length)}
                    >
                        { getMenuItemsList(children) }
                    </Menu.SubMenu>
                )
                return (
                    <Menu.Item title={hiddenTitle ? title : undefined} key={key} onClick={onClick} disabled={disabled(selectedRowKeys.length)} morePanelElement={inMoreBlock}>
                        {component}
                        {!hiddenTitle && <span className="costil-margin" style={{ marginLeft: 5 }}>{title}</span>}
                    </Menu.Item>
                );
            })
        );
    };
    function getComponent(name: string) {
        if ("ReceptionIcon" === name) {
            return <ReceptionIcon />;
        }
        return <div></div>;
    }
    function deleteMultiLookupLookupRows() {
        if (formData.current && selectedRowKeys) {
            let deleteIndexes: number[] = [];
            let newDataSource = dataSource?.filter((e: any, i: number) =>{
               if(!(e.key && !(~selectedRowKeys?.indexOf(e.key)))) deleteIndexes.push(i);
               return e.key && !(~selectedRowKeys?.indexOf(e.key))
            });
            let newFormData = formData.current?.filter((e: IValue, i: number) => {
                e = e;
                return !(~deleteIndexes?.indexOf(i)); 
            });
            setDataSource(newDataSource);
            formData.current = newFormData;
            setSelectedRowKeys([]);
            if (onChange) {
                onChange(newFormData);
            }  
        }
    };
    function getDataSource(values?: any[]) {
        let data = values?.map((value: any) => {
            let row;
            if(keyProperty && valueProperty) {
                row = { key: value.key, defaultColumn: value.value };   
            } else {
                row = { key: getRowKey(), defaultColumn: value.value };
            }
            if (value.other) {
                for (let column of value.other) {
                    row[column.name] = column.value;
                }
            }
            return row;
        });
        return data || [];
    };
    // function getDataSourceRow(row?: IValue) {
    //     let data = {
    //         let row = { rowkey: getRowKey(), defaultColumn: value.value };
    //         if (value.other) {
    //             for (let column of value.other) {
    //                 row[column.name] = column.value;
    //             }
    //         }
    //         return row;
    //     });
    //     return data;
    // };
    function getRowKey() {
        let newKey = `${Math.random()}`;
        const isUnique = formData.current?.find((e: IValue) => e?.key === newKey);
        if (isUnique) {
            newKey  = getRowKey();
        }
        return newKey;
    }
    function getColumns(otherColumns?: IColumn[]) {
        let columns: IColumn[] | undefined;

        if(hideDefaultColumn) {
            columns = otherColumns;
        } 
        else {
        columns = otherColumns ? [...otherColumns.slice(0, defaultColumnIndex ),
                                  defaultColumnSchema, 
                                  ...otherColumns.slice(defaultColumnIndex)] : [defaultColumnSchema];
        }
 
        return columns?.map((column: IColumn) => {
            return {
                key: column.name,
                title: column.label,
                dataIndex: column.name,
                //padding: 0,
                // render: (value: any, record: any, index: any) => {
                //     record = record;
                //     return (<FieldText
                //         type="FieldText"
                //         mode={column.disabled ? FormMode.display : FormMode.edit}
                //         defaultValue={value}
                //         onChange={(changedValue?: string) => {
                //             if (dataSource && dataSource?.length > index) {
                //                 const row = dataSource[index];
                //                 if (!row.other)
                //                     row.other = [];

                //                 let otherValue: IOtherValue | null = null;
                //                 for (let other of row.other)
                //                     if (other.name === column.name) {
                //                         otherValue = other;
                //                         break;
                //                     }

                //                 if (!otherValue)
                //                     otherValue = { value: changedValue, name: column.name };
                //                 else
                //                     otherValue.value = changedValue;
                //                 // setFormData([...dataSource]);
                //                 formData.current = [...dataSource]
                //                 console.log(formData.current);
                //             }
                //         }}
                //     />);
                // }
            }
        });
    }
    function showModalLookup() {
        tableModalApi?.current?.showModal();
    }
    function showDeleteModalMessage() {
        modalMessage("warning", deleteRowsToolbarWarning || '', [
            <SmartButton 
                    width={88}
                    key="1" 
                    onClick={(e) => {
                     deleteMultiLookupLookupRows();
                     modalMessage.destroy(e);
            }}> 
                Да 
            </SmartButton>, 
            <SmartButton 
                    width={88}
                    key="2" 
                    onClick={(e) => modalMessage.destroy(e)} 
                    type="primary">
                Нет
            </SmartButton>
        ]);
    }
    function getInitialValue(data: any[]) {        
        if(valueProperty && keyProperty && data) {
            return mapData(data, keyProperty, valueProperty);
        }

        return data; 
    }
    function mapData(data: any[], key: string, value: string) {
        if (data?.length <= 0) {
            return []
        }
        let newData
        if(otherColumns) {
            newData = data.map((item) => {
                if(item?.key && item?.value && item?.other) {
                    return item;
                }
                return { 
                    key: item?.[key],
                    value: item?.[value],
                    other: otherColumns.map(e => {
                        return {
                            value: item?.[e.name],
                            name: e.name
                        }
                    })
             };
             });
        } else {
            newData = data.map((item) => {
            return { 
               key: item?.[key],
               value: item?.[value],
            };
        });
        }
        return newData;
    }
    function getHistoryStateData(data: any) {
        return data.map((item: any) => {
            return (item?.data) ? item?.data : item;
        });
    }
    // function checkBackUrl(backUrl: string) {
    //     backUrl = backUrl;
    // }
});

export default DisplayTable;