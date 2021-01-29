import React from "react";
import { Form, SmartNumber } from "@eos/rc-controls";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";
import { Rule } from "rc-field-form/lib/interface"
import { BaseField } from "./BaseField";

/**Настройки целочисленного поля. */
export interface IInteger extends IField {
    /**Минимальное число. */
    min?: number;
    /**Максимальное число. */
    max?: number;
    /**Значение по умолчанию. */
    defaultValue?: number;
    /**Показывать кнопки увеличения числа. */
    showCounter?: boolean;
}

/**
 * Целочисленное поле.
 */
export const Integer = React.forwardRef<any, IInteger>((props: IInteger, ref) => {
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
        rules={[FieldsHelper.getIntegerRule()]}
    />);

    function getNew(props: IInteger, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <SmartNumber placeholder={props.placeholder} ref={ref} width={"100%"} required={props.required} defaultValue={props.defaultValue} min={props.min} max={props.max} counter={props.showCounter} />
            </Form.Item>
        );
    }
    function getEdit(props: IInteger, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: IInteger) {
        return FieldsHelper.getDisplayField(props.label, props.name);
    }
});

/**Возвращает значение поля типа "Дата". */
export function getFieldValueForClientRender() {
    return 1;
}