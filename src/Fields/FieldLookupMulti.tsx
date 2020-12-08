import React, { useContext, useMemo } from "react";
import { Form, Input } from "@eos/rc-controls";
import IField from "./IField";
import { IDataService } from "./LookupComponents/AjaxSelect";
import DisplayTable from "./LookupComponents/DisplayTable";
import { FormContext, IFormContext } from "../Context/Context";
import { Rule } from "rc-field-form/lib/interface";
import { BaseField } from "./BaseField";
export interface ITableColumn {
    title: string,
    dataIndex: string,
    key: string | number,
    render?: any,
};

export interface IMultiLookupRow {
    key: string | number;
    name?: string;
};

/**
 * Настройки Мульти Лукап поля.
 */
export interface ILookupMulti extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    //onChange?(item?: any): void;

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
 * Мульти Лукап поле.
 */
export const LookupMulti = React.forwardRef<any, ILookupMulti>((props: ILookupMulti, ref) => {
    const memoLookupMulti = useMemo(() => {
        return (<BaseField
            ref={ref}
            field={props}
            getNewField={getNew}
            getEditField={getEdit}
            getDisplayField={getDisplay}
        />);

    }, [props.mode, props.value]);

    return memoLookupMulti;

    function getNew(props: ILookupMulti, ref: any, rules?: Rule[]) {
        const context: IFormContext = useContext(FormContext);
        return (
            <div>
                <Form.Item label={props.label} name={props.name} style={{ display: "none" }} rules={rules}>
                    <Input />
                </Form.Item>
                <Form.Item name={props.name} rules={rules}>
                    <DisplayTable
                        rules={rules}
                        label={props.label || ''}
                        required={props.required}
                        name={props.name}
                        ref={ref}
                        columns={props.tableColumns}
                        mode={props.mode}
                        dataService={props.dataService}
                        notFoundContent={props.notFoundContent}
                        type={props.type}
                        onDataChange={(row) => context.setFieldValue(props.name || '', row)}
                    />
                </Form.Item>
            </div>
        );
    }
    function getEdit(props: ILookupMulti, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: ILookupMulti, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
});