import React from "react";
import { Form, Number } from "eos-webui-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

export interface IFieldInteger extends IField {
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
const FieldInteger = React.forwardRef<any, IFieldInteger>((props: IFieldInteger, ref) => {
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
export default FieldInteger;