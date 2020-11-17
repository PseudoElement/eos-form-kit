import React from "react";
import { Form, Number } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

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
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    rules.push(FieldsHelper.getIntegerRule());

    switch (props.mode) {
        case FormMode.display:
            return FieldsHelper.getDisplayField(props.label, props.name);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <Number ref={ref} style={{ width: "100%" }} required={props.required} defaultValue={props.defaultValue} min={props.min} max={props.max} counter={props.showCounter} />
                </Form.Item>
            );
    }
});

/**Возвращает значение поля типа "Дата". */
export function getFieldValueForClientRender() {
    return 1;
}