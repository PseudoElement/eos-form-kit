import React, { useEffect, useState, useRef } from 'react';
import { Menu, Table, Input, PlusIcon, BinIcon, Collapse, Badge } from "@eos/rc-controls";
import { FormMode } from "../../ClientForms/FormMode";
import { ITableColumn, IMultiLookupRow } from "../FieldLookupMulti";
import { ITableModalApi, TableModal } from "./TableModal";;
import { IDataService } from "./AjaxSelect";
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
    name?: string;
    /**Обязательность поля. */
    required?: boolean | undefined;

    onDataChange?(item?: any): void;

    rules: any;
}

const DisplayTable = React.forwardRef<any, IDisplayTable>(({
    value,
    columns,
    mode,
    onDataChange,
    notFoundContent,
    dataService,
    type,
    label,
    required
}) => {

    const [dataSource, setDataSource] = useState<IMultiLookupRow[] | undefined>(value);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [rowFromLookup, setRowFromLookup] = useState<IMultiLookupRow | undefined>();

    const tableModalApi = useRef<ITableModalApi>();
    const showModalLookup = () => {
        tableModalApi?.current?.showModal();
    }

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
            let newDataSource = dataSource.filter(({ key }) => key && !(~selectedRowKeys.indexOf(key)));
            setDataSource(newDataSource);
        }
    };

    const getFormatedColumns = (columns: ITableColumn[]) => {
        if (columns) {
            return columns.map((e: ITableColumn) => {
                return {
                    key: e.key,
                    title: e.title,
                    dataIndex: e.dataIndex,
                    padding: 0,
                    render: (value: any) => <Input style={{ width: "100%", margin: "12px 0" }}
                        value={value}
                        readOnly={true}
                    />,
                };
            });
        } else {
            return [{
                key :'name',
                dataIndex: 'value',
                title: 'name',
                render: (value: any) => <Input style={{ width: "100%", margin: "12px 0" }}
                    value={value}
                    readOnly={true}
                />,
            }]
        }
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

    useEffect(() => {
        if (rowFromLookup && dataSource) {
            setDataSource([rowFromLookup, ...dataSource]);
        }
    }, [rowFromLookup]);

    useEffect(() => {
        if (value) setDataSource(value);
    }, [value]);

    useEffect(() => {
        if (onDataChange) onDataChange(dataSource);
    }, [dataSource]);

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
                            dataSource={dataSource}
                            columns={getFormatedColumns(columns)}
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
});

export default DisplayTable;