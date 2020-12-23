import React, { useEffect, useState, useRef } from 'react';
import { Menu, Table, PlusIcon, BinIcon, Collapse, Badge, message, modalMessage, Button } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { IValue, IColumn, IOtherValue, } from "../FieldLookupMulti";
import { IDataService, 
    //IOptionItem,
 } from "./AjaxSelect";
//import { Lookup as FieldLookup,  } from "../FieldLookup";
import { Select as FieldSelect,  IOption  } from "../FieldSelect";
import { Text as FieldText } from "../FieldText";
//import { ILookup } from "../FieldLookup";
// import { prependOnceListener } from 'process';
//import { AjaxSelect } from '../..';

export interface ITableMenuTool {
    key: string | number;
    component?: JSX.Element;
    title?: string;
    onClick?: () => void;
    hiddenTitle?: boolean;
    disabled?: boolean;
    children?: ITableMenuTool[];
    inMoreBlock?: boolean;
};

export interface IDisplayTableRow {
    value?: IValue[];
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
    /**Разешить редактирование столбца по умолчанию*/
    disabledDefaultColumn?: boolean;
    /**Спрятать столбец по умолчанию.*/
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

    onDataChange?(item?: any): void;

    otherColumns?: IColumn[];
}


const DisplayTableRow = React.forwardRef<any, IDisplayTableRow>(({
    value,
    mode,
    onDataChange,
    dataService: getDataService,
    label,
    required,
    showHeader,
    defaultColumnLabel,
    defaultColumnIndex,
    hideDefaultColumn,
    disabledDefaultColumn,
    otherColumns,
    allowDuplication,
    addRowToolbarTitle,
    deleteRowsToolbarTitle,
    addRowToolbarWarning,
    deleteRowsToolbarWarning,
    hiddenDeleteToolTitle,
    hiddenAddRowToolTitle
}) => {
    const [dataSource, setDataSource] = useState<object[] | undefined>();
    const formData = useRef(value);

    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    //const [queryAmountInfo, setQueryAmountInfo] = useState<string>("");
    const [items, setItems] = useState<IOption[]>([]);

    const defaultColumnSchema: IColumn = {
        "label": defaultColumnLabel,
        "disabled": hideDefaultColumn,
        "name": "defaultColumn"
    };
    const pagination = {
        showMoreBtn: false,
        pageSizeOptions: undefined,
    };
    const rowSelection = {
        preserveSelectedRowKeys: false,
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    const menu = [
        {
            component: <PlusIcon />,
            title: addRowToolbarTitle || 'Добавить строку',
            disabled: isDisplay(),
            onClick: addNewRow,
            hiddenTitle: hiddenDeleteToolTitle || false,
            key: addRowToolbarTitle || 'Удалить строки'
        },
        {
            component: <BinIcon />,
            title: deleteRowsToolbarTitle || '',
            disabled: (isDisplay() || selectedRowKeys.length < 1),
            onClick: deleteRowsToolbarWarning ? showDeleteModalMessage : deleteMultiLookupLookupRows,
            hiddenTitle: hiddenAddRowToolTitle || false,
            key: deleteRowsToolbarTitle || 'BinIcon'
        }
    ];

    /**
     * Запрос
     * @search search параметры запроса
     */
    async function loadItemById(search?: string) {
        setIsLoading(true);
        return getDataService?.loadDataAsync(search ?? '').then(
            (data: IOption[]) => {
                let items: IOption[] = data;
                if (getDataService?.resultsAmount !== null && getDataService?.resultsAmount !== undefined) {
                    if (items?.length >= getDataService?.resultsAmount) {
                        let shortArray = items?.slice(0, getDataService?.resultsAmount - 1);
                        setItems([...shortArray]);
                    } 
                    else {
                        setItems(items);
                    }
                }
                else {                
                    setItems(items);
                }
                setIsLoading(false);
            }
        )
            .catch(
                (err: any) => {
                    console.error(err);
                    setItems([]);
                    setIsLoading(false)
                }
            )
    }

    useEffect(() => {
        if (value) {
            setDataSource(getDataSource(value));
            formData.current = value;
        } 
        else {
            setDataSource([]);
            formData.current = []; 
        }
        loadItemById("");
        setSelectedRowKeys([]);
    }, [value]);
    useEffect(() => {
        if (onDataChange) 
            onDataChange(formData.current);      
    }, [formData.current]);

    return (
        <div>
            <Collapse key={'1'} expandIconPosition={'right'} ghost bordered={true}  >
                <Collapse.Panel key={'1'} forceRender={true}
                    header={
                        <div style={{ borderBottom: '1px solid #E6E6E6' }}>
                            {(!required || formData.current?.length) ?
                                <Badge count={formData.current?.length} type="text" >{label}</Badge> :
                                <Badge count={' '} type="text" color="red">{label}</Badge>
                            }
                        </div>
                    }>
                    <Table.Menu menu={getMenuItemsList(menu)}
                                gutter="5px"
                                rowCount={formData.current?.length}>
                        <Table
                            loading={isLoading}
                            fullHeight
                            dataSource={dataSource}
                            columns={getColumns(otherColumns)}
                            rowSelection={rowSelection}
                            showHeader={showHeader}
                            settings={{ isDraggable: false }}
                            pagination={pagination}
                        />
                    </Table.Menu>
                </Collapse.Panel>
            </Collapse>
        </div>
    );

    function addNewRow() {
        if (onDataChange) {
            onDataChange(formData.current);
        } 
        let values: IValue[] = formData.current ? formData.current : [];

        let newRow: IValue;
        if(formData.current && otherColumns) {
            const defaultOther = dataSource && otherColumns.map((e: IOtherValue) => {
                return {
                    name: e.name,
                    value: ''
                }
            });
            newRow = { key: '', value: '', other: defaultOther  };
        } 
        else {
            newRow = { key: '', value: '' };  
        }

        const newValues = [...values, newRow];
        setDataSource(getDataSource(newValues));
        formData.current = newValues;
    }
    function isDisplay() {
        return FormMode.display === mode;
    };
    function getMenuItemsList(toolsList: ITableMenuTool[]) {
        return (
            toolsList.map(({ component, onClick, disabled, title, children, key, hiddenTitle, inMoreBlock }) => {
                if (children) return (
                    <Menu.SubMenu
                        icon={component}
                        morePanelElement={inMoreBlock}
                        title={hiddenTitle ? title : undefined}
                        key={key}
                        disabled={disabled}
                    >
                        {getMenuItemsList(children)}
                    </Menu.SubMenu>
                )
                return (
                    <Menu.Item title={hiddenTitle ? title : undefined} key={key} onClick={onClick} disabled={disabled} morePanelElement={inMoreBlock}>
                        {component}
                        {!hiddenTitle && <span className="costil-margin" style={{ marginLeft: 5 }}>{title}</span>}
                    </Menu.Item>
                );
            })
        );
    };
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
        }
    };
    function getDataSource(values?: IValue[]) {
        let data = values?.map((value: IValue) => {
            let row = { key: getRowKey(), defaultColumn: value.value };
            if (value.other) {
                for (let column of value.other) {
                    row[column.name] = column.value;
                }
            }
            return row;
        });
        return data || [];
    };
    function getRowKey() {
        let newKey = `${Math.random()}`;
        const isUnique = formData.current?.find((e: IValue) => e.key === newKey);
        if (isUnique) {
            newKey  = getRowKey();
        } 
        return newKey;
    }
    function showDeleteModalMessage() {
        modalMessage("warning", deleteRowsToolbarWarning || '', [
            <Button style={{ width: 88 }} 
                    key="1" 
                    onClick={(e) => {
                    deleteMultiLookupLookupRows();
                    modalMessage.destroy(e);
            }}> 
                Да 
            </Button>, 
            <Button style={{ width: 88 }} 
                    key="2" 
                    onClick={(e) => modalMessage.destroy(e)} 
                    type="primary">
                Нет
            </Button>
        ]);
    }
    function getColumns(otherColumns?: IColumn[]) {
        let columns: IColumn[] = otherColumns ? [...otherColumns.slice(0, (defaultColumnIndex || 1)),
                                                defaultColumnSchema, 
                                                ...otherColumns.slice((defaultColumnIndex || 1))] : [defaultColumnSchema];

        return columns.map((column: IColumn ) => {
            return {
                key: column.name,
                title: column.label,
                dataIndex: column.name,
                align: "center" as any,
                width: `${Math.trunc(100/columns.length)}%`,
                render: (value: any, record: any, index: any) => {
                    record = record;
                    if(column.name === "defaultColumn") {
                        return (
                        <FieldSelect
                            type="FieldSelect"
                            values={items}
                            required={required}
                            defaultValue={value}
                            label={column.label}
                            mode={(disabledDefaultColumn || isDisplay()) ? FormMode.display : FormMode.edit}
                            onChange={(changedValue?: any) => {
                                const item = items.find((e: IOption) => e.key === changedValue);

                                if (formData.current && formData.current?.length > index) {
                                    const row = formData.current[index];

                                    if(!allowDuplication) {
                                        const isDuplicate = formData?.current?.find((e: IValue) => (e.key === changedValue && row.key !== e.key));
                                        if(isDuplicate) {
                                            row.key = '';
                                            row.value ='';
                                            if (addRowToolbarWarning) {
                                                message("warning", addRowToolbarWarning);
                                            } 
                                            setDataSource(getDataSource(formData.current));
                                            return;
                                        }
                                    }
                                    row.key = changedValue || '';
                                    row.value = item?.value || '';
                                    if (item?.other) {
                                        row.other = item?.other;
                                    } 
                                    setDataSource(getDataSource(formData.current));
                                }
                            }}
                        />);
                    }
                    return (<FieldText
                        type="FieldText"
                        mode={(column.disabled || isDisplay()) ? FormMode.display : FormMode.edit}
                        defaultValue={value}
                        label={column.label}
                        onChange={(changedValue?: string) => {
                            if (formData.current && formData.current?.length > index) {
                                let row = formData.current[index];
                                if (!row.other) {
                                    row.other = [];
                                }
                                let otherValue: IOtherValue | null = null;
                                for (let other of row.other)
                                    if (other.name === column.name) {
                                        otherValue = other;
                                        break;
                                    }

                                if (!otherValue) {
                                    row.value = changedValue;
                                }
                                else {
                                    otherValue.value = changedValue;
                                }
                                //formData.current = [...formData.current]
                            }
                        }}
                    />);
                }
            }
        });
    }
});

export default DisplayTableRow;