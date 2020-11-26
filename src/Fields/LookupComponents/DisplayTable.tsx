import React, { useEffect, useState } from 'react';
import { Table } from '@eos/rc-controls';
//import { IOptionItem } from "./AjaxSelect";

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

export interface IDisplayInput {

    value?: ITableRow[];

    columns?: any;

    rowSelection?: any;

    selectedRow?: ITableRow;
    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    tableMenu: any;
}

const DisplayTable = React.forwardRef<any, IDisplayInput>(({value, columns, rowSelection, selectedRow, onChange, tableMenu}) => {
    const [dataSource, setDataSource] = useState<ITableRow[] | undefined>(value);

   useEffect(() => {
    if (selectedRow && dataSource) setDataSource([selectedRow, ...dataSource]);
}, [selectedRow]);

    useEffect(() => {
        if (onChange) onChange(dataSource);
    }, [dataSource]);

    return (
        <Table.Menu
            menu={tableMenu}
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