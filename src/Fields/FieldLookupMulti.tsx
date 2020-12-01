import React from "react";
import { Collapse, Form, Badge } from "@eos/rc-controls";
import IField from "./IField";
import { IDataService } from "./LookupComponents/AjaxSelect";
import DisplayTable from "./LookupComponents/DisplayTable";
export interface ITableColumn {
    title: string,
    dataIndex: string,
    key: string | number,
};

export interface IMultilookupRow {
    key: string | number;
    name?: string;
};

/**
 * Настройки МультиЛукап поля.
 */
export interface ILookupMulti extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    /**
     * Колонки таблицы
     */
    tableColumns?: ITableColumn[];
}

/**
 * МультиЛукап поле.
 */
export const LookupMulti = React.forwardRef<any, ILookupMulti>((props: ILookupMulti, ref) => {

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
                            <Badge count={0} type="text">{props.label}</Badge>
                        </div>
                    }
                >
                    <Form.Item name={props.name} >
                        <DisplayTable
                            ref={ref}
                            columns={props.tableColumns}
                            onChange={props.onChange}
                            mode={props.mode}
                            dataService={props.dataService}
                            required={props.required}
                            form={props.form}
                            notFoundContent={props.notFoundContent}
                            type={props.type}
                        />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
});