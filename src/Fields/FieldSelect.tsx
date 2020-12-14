import { Form, Select as RcSelect } from "@eos/rc-controls";
import React from "react";
import { BaseField } from "./BaseField";
import IField from "./IField";
import { Rule } from "rc-field-form/lib/interface"

/**Настройки поля типа "Выпадающий список"*/
export interface ISelect extends IField {
    /**Список значений в выпадающем списке. */
    values?: IOption[];

    /**Значение поля по умолчанию. */
    defaultValue?: string;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;
}

/**Значение в выпадающим списке. */
export interface IOption {
    /**Значение. */
    key: string;
    /**Отображаемое значение в UI. */
    value: string;
    /**
     * Параметр запрета на выбор значения
     */
    disabled?: boolean;

    /** Значения других полей */
    other?: IOtherValue[];
}

export interface IOtherValue {
    /**Наименование поля. */
    name: string;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
}

/**Поле типа "Выпадающий список". */
export const Select = React.forwardRef<any, ISelect>((props: ISelect, ref) => {
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />);

    function getNew(props: ISelect, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                <RcSelect
                    ref={ref}
                    required={props.required}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                >
                    {props.values?.map(value => {
                        return <RcSelect.Option key={value.key} value={value.key}>{value.value}</RcSelect.Option>
                    })}
                </RcSelect>
            </Form.Item >
        );
    }
    function getEdit(props: ISelect, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: ISelect, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                <RcSelect disabled={true}
                    ref={ref}
                    required={props.required}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                >
                    {props.values?.map(value => {
                        return <RcSelect.Option key={value.key} value={value.key}>{value.value}</RcSelect.Option>
                    })}
                </RcSelect>
            </Form.Item >
        );
    }
});
