import React, { useEffect, useState, useRef, useImperativeHandle, 
    //useMemo 
} from 'react';
import { Menu, Table, 
    //Input, 
    PlusIcon, BinIcon, Collapse, Badge } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { 
    //ITableColumn, 
    IMultiLookupRow } from "../FieldLookupMulti";
import { ITableModalApi, TableModal } from "./TableModal";;
import { IDataService } from "./AjaxSelect";
import fields from "../../Fields/Fields";
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

    value?: IMultiLookupRow[];

    columns?: any;

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
    name?: any;
    /**Обязательность поля. */
    required?: boolean | undefined;

    onDataChange?(item?: any): void;

    rules: any;

    otherColumns: any;

    context: any;
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
    otherColumns
}, ref) => {

    const [dataSource, setDataSource] = useState<IMultiLookupRow[] | undefined | any>(value);
    const [formData, setFormData] = useState<IMultiLookupRow[] | undefined | any>(value);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [rowFromLookup, setRowFromLookup] = useState<IMultiLookupRow | undefined>();
    //const [formatedDataSource, setFormatedDataSource] = useState<any>();

    const tableModalApi = useRef<ITableModalApi>();
    const showModalLookup = () => {
        tableModalApi?.current?.showModal();
    }

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): any => {
        const api: any = {
            getData() {
                if (onDataChange) onDataChange(dataRef.current);
            }
        }
        return api;
    });

    //const DisplayTableApi = useRef<any>();

    const dataRef = useRef<any>();

    dataRef.current = value;

    //const fieldType = 'FieldText';

    // const defaultColumn = [{
    //     key: name,
    //     title: name,
    //     dataIndex: 'value',
    //     padding: 0,
    //     render: (value: any, record: any, index: any) => {
    //     console.log (value, record, index);
    //     return React.createElement(fields[fieldType], { 
    //         type: fieldType,
    //         mode: mode,
    //         name: `${name}`, 
    //         key: name, 
    //         disabled: true,
    //         defaultValue: value});
    //     }
    //     // <Input style={{ width: "100%", margin: "12px 0" }}
    //     //     value={value}
    //     //     readOnly={true}
    //     // />,
    // }];

    const defaultColumnShema = { 
            "disabled": true, 
            "label": "Особенности", 
            "name": "value", 
            "required": false, 
            "requiredMessage": null, 
            "type": "FieldText", 
            "additionalText": null, 
            "allowClear": false, 
            "maxLength": null
        };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const getMenuItemsList = (toolsList: ITableMenuTool[]) => {
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
                        {!hiddenTitle && <span className="costil-margin" style={{ marginLeft: 1 }}>{title}</span>}
                    </Menu.Item>
                );
            })
        );
    };

    /**
     * Удаление записей в таблице
     */
    const deleteMultiLookupLookupRows = () => {
        if (dataSource) {
            let newDataSource = dataSource.filter((e: any) => e.key && !(~selectedRowKeys.indexOf(e.key)));
            setDataSource(newDataSource);
           // setFormData(newDataSource);
        }
    };

    const getFormatedDataSource = (value: any) => {
        if (!value[0].otherColumns) return value;

        let n = value.map((row: any) => {
            let newRow = {
                key: row.key,
                value: row.value
            }
        
            let otherValues = row.otherColumns.reduce((sum: any, cur: any, i: any) => {
                return {...sum, [otherColumns[i].name]: cur.value}
            }, {});
            return {...newRow, ...otherValues};
        });

        return n;
    };

    console.log(getFormatedDataSource(value));

    const getFormatedColumns = (otherColumns: any) => {
            let columns = otherColumns ? [defaultColumnShema,  ...otherColumns] : [defaultColumnShema];

            return  columns.map((e: any) => {
                return {
                    key: e.name,
                    title: e.name,
                    dataIndex: e.name,
                    padding: 0,
                    render: (value: any, record: any, index: any) => {
                        record = record;
                        return React.createElement(fields[e.type], { 
                            ...e, 
                            name: `${e.name}${index}`, 
                            key: e.name, 
                            defaultValue: value,
                            onChange: (value: any) => {
                               setFormData((state: any) => {

                            //    let indexn = 0;
                            //    state?.forEach((el: any, i: any) => {
                            //        if(el.key === `value${index}`) {
                            //            indexn  = i;
                            //        }
                            //    });
                               let row = state?.[index];
                               if (e.name === 'value') {
                                    let newRow = {...row, [e.name]: value.currentTarget.value};
                                let newData = [...state?.slice(0, index), newRow, ...state?.slice(index + 1)];
                                if(onDataChange) onDataChange(newData);
                                return newData;
                                // dataRef.current = [...dataRef.current?.slice(0, index), newRow, ...dataRef.current?.slice(index + 1)];
                                // return dataRef;
                                } else {
                                        let otherColumnsn = row.otherColumns;

                                        let columnIndex = 0;
                                        otherColumnsn.forEach((el: any, i: any) => {
                                            if(el.key === `${e.name}${index}`) {
                                                debugger;
                                                columnIndex  = i;
                                            }
                                        });
                                        let column = otherColumnsn[columnIndex];
                                        
                                        column = {...column, value: value.currentTarget.value};
                                        let newOtherColumns = [...otherColumnsn?.slice(0, columnIndex), column, ...otherColumnsn?.slice(columnIndex + 1)];
                                        let newRow2 = {...row, otherColumns: newOtherColumns};
                                        value.target.focus();
                                        const newData = [...state?.slice(0, index), newRow2, ...state?.slice(index + 1)];
                                        if(onDataChange) onDataChange(newData);
                                        return newData;
    
                                        // dataRef.current = ((dataRef: any) => { 
                                        //     return [...dataRef.current?.slice(0, index), newRow2, ...dataRef.current?.slice(index + 1)]
                                        // // })(dataRef);
                                        // return dataRef;
                                }
});
                        }
                    });
                }
            }
        });
    }

    const isDisplay = () => {
        return FormMode.display === mode;
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

    const getRowFromLookup = (row: any) => { 
        let newOtherColumns = otherColumns.map((e: any) => {
           return {
               key: `${e.name}${row.key[5]}`,
               value: ''
           } 
        });

        setDataSource((data: any) => {
            return([...data, {...row,  otherColumns: newOtherColumns}]);

        });
        setFormData((data: any) => {
            return([...data, {...row,  otherColumns: newOtherColumns}]);

        });
    };


    useEffect(() => {
        if (rowFromLookup && dataSource) {
            getRowFromLookup(rowFromLookup);
        }
    }, [rowFromLookup]);

    useEffect(() => {
        if (value) {
            setDataSource(value);
            setFormData(value);
            //setFormatedDataSource(getFormatedDataSource(value));
        }
    }, [value]);

    useEffect(() => {
        console.log(dataRef);
        if (onDataChange) onDataChange(formData);
    }, [formData]);

    //let memo =  useMemo(() => {

        return (
            <div>
                <Collapse
                    key={'1'}
                    expandIconPosition={'right'}
                    ghost
                    bordered={true}
                >
                    <Collapse.Panel
                        key={'1'}
                        forceRender={true}
                        header={
                            <div
                                style={{
                                    borderBottom: '1px solid #E6E6E6'
                                }}
                            >
                                {(!required || dataSource?.length) ?
                                    <Badge count={dataSource?.length} type="text" >{label}</Badge> :
                                    <Badge count={' '} type="text" color="red">{label}</Badge>
                                }
                            </div>
                        }
                    >
                        <Table.Menu
                            menu={getMenuItemsList(menu)}
                        >
                            <Table
                                fullHeight
                                dataSource={getFormatedDataSource(dataSource)}
                                columns={getFormatedColumns(otherColumns)}
                                rowSelection={rowSelection}
                                showHeader={false}
                            />
                        </Table.Menu>
                        <TableModal
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
    //}, [dataSource, selectedRowKeys]);

    //return memo;
});

export default DisplayTable;