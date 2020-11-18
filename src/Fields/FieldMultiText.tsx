import React from "react";
import { Form, TextArea } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

/**Настройки мульти текстового поля. */
export interface IMultiText extends IField {
    /**Количество строк. */
    rows?: number;
    /**Максимальное количество символов. */
    maxLength?: number;
}

/**
 * Мульти текстовое поле.
 */
export const MultiText = React.forwardRef<any, IMultiText>((props: IMultiText, ref) => {
    const DEFAULT_ROWS = 6;

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
    switch (props.mode) {
        case FormMode.display:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }}>
                    <TextArea style={{ width: "100%" }} ref={ref} rows={props.rows ?? DEFAULT_ROWS} readOnly />
                </Form.Item>
            );
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <TextArea style={{ width: "100%" }} ref={ref} required={props.required} rows={props.rows ?? DEFAULT_ROWS} maxLength={props.maxLength} />
                </Form.Item>
            );
    }
});