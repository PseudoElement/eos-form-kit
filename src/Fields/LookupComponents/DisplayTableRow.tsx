import React, { useEffect, useState, useRef } from 'react';
import { Menu, Table, PlusIcon, BinIcon, Collapse, Badge, } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { IValue, IColumn, IOtherValue, } from "../FieldLookupMulti";
import { IDataService, } from "./AjaxSelect";
import { Lookup as FieldLookup,  } from "../FieldLookup";
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
    allowTakes?: boolean;
    /**Разешить редактирование столбца по умолчанию*/
    disabledDefaultColumn?: boolean;

    onDataChange?(item?: any): void;

    rules: any;

    otherColumns?: IColumn[];
}


const DisplayTableRow = React.forwardRef<any, IDisplayTableRow>(({
    value,
    mode,
    onDataChange,
    dataService,
    label,
    required,
    showHeader,
    defaultColumnLabel,
    defaultColumnIndex,
    disabledDefaultColumn,
    otherColumns
}) => {
    const [dataSource, setDataSource] = useState<object[] | undefined>();
    const formData = useRef(value);

    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

    const defaultColumnSchema: IColumn = {
        "label": defaultColumnLabel,
        "disabled": disabledDefaultColumn,
        "name": "defaultColumn"
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
            title: 'PlusIcon',
            disabled: isDisplay(),
            onClick: addNewRow,
            hiddenTitle: true,
            key: 'PlusIcon'
        },
        {
            component: <BinIcon />,
            title: 'BinIcon',
            disabled: isDisplay(),
            onClick: deleteMultiLookupLookupRows,
            hiddenTitle: true,
            key: 'BinIcon'
        }
    ];

    useEffect(() => {
        if (value) {
            setDataSource(getDataSource(value));
            formData.current = value;
        } else {
            setDataSource([]);
            formData.current = []; 
        }
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
                            fullHeight
                            dataSource={dataSource}
                            columns={getColumns(otherColumns)}
                            rowSelection={rowSelection}
                            showHeader={showHeader}
                        />
                    </Table.Menu>
                </Collapse.Panel>
            </Collapse>
        </div>
    );

    function addNewRow() {
        if (onDataChange) onDataChange(formData.current);
        let values: IValue[] = formData.current ? formData.current : [];

        let newRow: IValue;
        if(formData.current && formData?.current[0]?.other) {
            const defaultOther = dataSource && formData.current[0].other?.map((e: IOtherValue) => {
                return {
                    name: e.name,
                    value: ''
                }
            });
            newRow = { key: getRowKey(), value: '', other: defaultOther  };
        } else {
            newRow = { key: getRowKey(), value: '' };  
        }

        const newValues = [...values, newRow];
        setDataSource(newValues);
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
        if (isUnique) newKey  = getRowKey();
        return newKey;
    }

    function getColumns(otherColumns?: IColumn[]) {
        let columns: IColumn[] = otherColumns ? [...otherColumns.slice(0, (defaultColumnIndex || 1)),
                                                defaultColumnSchema, 
                                                ...otherColumns.slice((defaultColumnIndex || 1))] : [defaultColumnSchema];

        return columns.map((column: IColumn) => {
            return {
                key: column.name,
                title: column.label,
                dataIndex: column.name,
                padding: 0,
                render: (value: any, record: any, index: any) => {
                    record = record;
                    if(column.name === "defaultColumn") {
                        return (<FieldLookup
                            type="FieldLookup"
                            defaultValue={value}
                            label={column.label}
                            mode={column.disabled ? FormMode.display : FormMode.edit}
                            dataService={dataService}
                            onChange={(changedValue?: any) => {
                                if (formData.current && formData.current?.length > index) {
                                    let row = formData.current[index];
                                    if (!row.other)
                                        row.other = [];
       
                                    let otherValue: IOtherValue | null = null;
                                    for (let other of row.other)
                                        if (other.name === column.name) {
                                            otherValue = other;
                                            break;
                                        }
    
                                    if (!otherValue) {
                                        row.value = changedValue?.value || '';
                                    }
                                    else
                                        otherValue.value = changedValue?.value || '';
                                    //formData.current = [...formData.current]
                                }
                            }}
                        />);
                    }
                    return (<FieldText
                        type="FieldText"
                        mode={column.disabled ? FormMode.display : FormMode.edit}
                        defaultValue={value}
                        label={column.label}
                        onChange={(changedValue?: string) => {
                            if (formData.current && formData.current?.length > index) {
                                let row = formData.current[index];
                                if (!row.other)
                                    row.other = [];
   
                                let otherValue: IOtherValue | null = null;
                                for (let other of row.other)
                                    if (other.name === column.name) {
                                        otherValue = other;
                                        break;
                                    }

                                if (!otherValue) {
                                    row.value = changedValue;
                                }
                                else
                                    otherValue.value = changedValue;
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