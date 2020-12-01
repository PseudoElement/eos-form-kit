import React, { useState } from "react";
import { Collapse, Form, Input, Badge } from "@eos/rc-controls";
import IField from "./IField";
import { IDataService } from "./LookupComponents/AjaxSelect";
import DisplayTable from "./LookupComponents/DisplayTable";
import { FieldsHelper } from './FieldsHelper';
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
    const [rowCount, setRowCount] = useState<number | undefined>();

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    return (
        <div>
            <Form.Item label={props.label} name={props.name} style={{display: "none"}} rules={rules}>
                <Input />
            </Form.Item>
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
                            {(!props.required || rowCount) ? 
                                <Badge count={rowCount} type="text" >{props.label}</Badge> :
                                <Badge count={' '} type="text" color="red">{props.label}</Badge> 
                                }
                        </div>
                    }
                >
                    <Form.Item name={props.name} rules={rules}>
                        <DisplayTable
                            fieldName={props.name}
                            ref={ref}
                            columns={props.tableColumns}
                            onChange={(row) => setRowCount(row.length)}
                            mode={props.mode}
                            dataService={props.dataService}
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