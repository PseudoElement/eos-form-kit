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
    /** Параметр запрета на выбор значения */
    disabled?: boolean;
    /** Значения других полей */
    other?: IOtherValue[];
    /** Подскраска поля (необходима для выделения структурного признака синим цветом) */
    isSpecific?: boolean;
}

export interface IOtherValue {
    /**Наименование поля. */
    name: string;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
}

/**Поле типа "Выпадающий список". */
export const Select = React.forwardRef<any, ISelect>((props: ISelect, ref) => {
    /** Цвет особого элемента списка */
    const SPECIFIC_ELEM_COROL_VALUE: string = "#2196F3";
    /** Цвет задизейбленного элемента списка */
    const DISABLED_ELEM_COROL_VALUE: string = "#BABABA";

    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />);

    function getNew(props: ISelect, ref: any, rules?: Rule[], required?: boolean) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                <RcSelect
                    placeholder={props.placeholder}
                    ref={ref}
                    required={required}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                >
                    {props.values?.map((value: any) => {
                        return <RcSelect.Option
                                    key={value?.key} 
                                    value={value?.key}
                                    disabled={value?.disabled}
                                    item={value}
                                    style={value?.disabled ? {color: DISABLED_ELEM_COROL_VALUE} : value?.isSpecific ? {color: SPECIFIC_ELEM_COROL_VALUE} : {}}
                                >{value.value}</RcSelect.Option>
                    })}
                </RcSelect>
            </Form.Item >
        );
    }
    function getEdit(props: ISelect, ref: any, rules?: Rule[], required?: boolean) {
        return getNew(props, ref, rules, required);
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
