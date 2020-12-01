import React, { useEffect, useState, useRef } from 'react';
import { Menu, PlusIcon, BinIcon } from "@eos/rc-controls";
import { Table } from '@eos/rc-controls';
import { FormMode } from "../../ClientForms/FormMode";
import { IModalApi, TableModal } from "./TableModal"
import { IDataService } from "./AjaxSelect"
export interface ITableRow {
    /**
     * Программное значение которое вернёт компонент.
     */
    key?: string;
    /**
     * Отображаемый текст значения для пользователя.
     */
    value?: string;
}
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

export interface IDisplayInput {

    value?: ITableRow[];

    columns?: any;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    onModalVisible?(): void;

    mode?: any;
    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    required: any;

    dataService: IDataService;

    type?: any
}

const DisplayTable = React.forwardRef<any, IDisplayInput>(({ 
        value, 
        columns,
        mode, 
        onChange,
        notFoundContent,
        required,
        dataService,
        form,
        type
    }) => {
    const [dataSource, setDataSource] = useState<ITableRow[] | undefined>(value);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [rowFromLookup, setRowFromLookup] = useState<ITableRow | undefined>();

    const modalApi = useRef<IModalApi>();

    const showModalLookup = () => {
        modalApi?.current?.showModal();
    }

    const rowSelection = {
        preserveSelectedRowKeys: false,
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
        if(dataSource) {
            let newDataSource = dataSource.filter(({ key }) => key && !(~selectedRowKeys.indexOf(key)));
            setDataSource(newDataSource);
        }
    };

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
        if (rowFromLookup && dataSource) setDataSource([rowFromLookup, ...dataSource]);
    }, [rowFromLookup]);

    useEffect(() => {
        if (onChange) onChange(dataSource);
    }, [dataSource]);

    return (
        <div >
                <Table.Menu
                    menu={getMenuItemsList(menu)}
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowSelection={rowSelection}
                        showHeader={false}
                    />
                </Table.Menu>
                <TableModal 
                    mode={mode}
                    type={type}
                    ref={modalApi}
                    dataService={dataService}
                    required={required}
                    form={form}
                    notFoundContent={notFoundContent}
                    onFinish={(row) => setRowFromLookup(row)}
                />
        </div>
    );
});

export default DisplayTable;