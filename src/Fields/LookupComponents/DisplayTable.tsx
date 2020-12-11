import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Menu, Table, PlusIcon, BinIcon, Collapse, Badge, message } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { IValue, IColumn, 
    //IOtherValue 
} from "../FieldLookupMulti";
import { ITableModalApi, TableModal } from "./TableModal";;
import { IDataService, 
    //IOptionItem 
} from "./AjaxSelect";
//import { Text as FieldText } from "../FieldText";
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

export interface IDisplayTable {
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

    onDataChange?(item?: any): void;

    rules: any;

    otherColumns?: IColumn[];
}

const DisplayTable = React.forwardRef<any, IDisplayTable>(({
    value,
    mode,
    onDataChange,
    notFoundContent,
    dataService,
    type,
    label,
    required,
    showHeader,
    defaultColumnLabel,
    defaultColumnIndex,
    modalWindowTitle,
    allowDuplication,
    otherColumns
}, ref) => {
    const [dataSource, setDataSource] = useState<object[] | undefined>();
    const formData = useRef(value);

    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [rowFromLookup, setRowFromLookup] = useState<IValue | undefined>();

    const tableModalApi = useRef<ITableModalApi>();

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): any => {
        const api: any = {
            getData() {
                if (onDataChange)
                    onDataChange(dataRef.current);
            }
        }
        return api;
    });

    const dataRef = useRef<any>();
    dataRef.current = value;

    const defaultColumnSchema: IColumn = {
        "label": defaultColumnLabel,
        "disabled": true,
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
            onClick: showModalLookup,
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
        if (rowFromLookup && formData.current) {
            getRowFromLookup(rowFromLookup);
        }
    }, [rowFromLookup]);
    useEffect(() => {
        if (value) {
            setDataSource(getDataSource(value));
            formData.current = value;
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
            message("warning", "Такой элемент уже существует");
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

        const newValues = [...values, newRow];
        if (dataSource && getDataSource) setDataSource([...dataSource, ...getDataSource([newRow]) ]);
        formData.current = newValues;
    };
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
        const isUnique = formData.current?.find((e: IValue) => e.key === newKey);
        if (isUnique) newKey  = getRowKey();
        return newKey;
    }
    function getColumns(otherColumns?: IColumn[]) {
        let columns: IColumn[] = otherColumns ? [...otherColumns.slice(0, defaultColumnIndex ),
                                                defaultColumnSchema, 
                                                ...otherColumns.slice(defaultColumnIndex)] : [defaultColumnSchema];
        return columns.map((column: IColumn) => {
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

});

export default DisplayTable;