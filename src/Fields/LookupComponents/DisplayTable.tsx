import React, { useEffect, useState } from 'react';
import { Menu, PlusIcon, BinIcon } from "@eos/rc-controls";
import { Table } from '@eos/rc-controls';
import { FormMode } from "../../ClientForms/FormMode";
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

    selectedRow?: ITableRow;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    onModalVisible?(): void;

    mode?: any;
}

const DisplayTable = React.forwardRef<any, IDisplayInput>(({ value, columns, selectedRow, mode, onChange, onModalVisible }) => {
    const [dataSource, setDataSource] = useState<ITableRow[] | undefined>(value);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

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
     * Создание записи в таблице
     */
    const newMultiLookupRow = () => {
        if (onModalVisible) onModalVisible();
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
            onClick: newMultiLookupRow,
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
        if (selectedRow && dataSource) setDataSource([selectedRow, ...dataSource]);
    }, [selectedRow]);

    useEffect(() => {
        if (onChange) onChange(dataSource);
    }, [dataSource]);

    return (
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
    );
});

export default DisplayTable;