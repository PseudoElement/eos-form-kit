import { Form, Checkbox as RcCheckbox } from "@eos/rc-controls";
import React, { useImperativeHandle } from "react";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

/**Настройки поля галочки. */
export interface ICheckbox extends IField {
    /**Текст рядом с галочкой. */
    description?: string;
}

/**
 * Поле галочка.
 */
export const Checkbox = React.forwardRef<any, ICheckbox>((props: ICheckbox, ref: any) => {
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    useImperativeHandle(ref, () => { });

    switch (props.mode) {
        case FormMode.display:
            return (<Form.Item valuePropName="checked" label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <RcCheckbox disabled={true}>{props.description}</RcCheckbox>
            </Form.Item>);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item valuePropName="checked" label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <RcCheckbox>{props.description}</RcCheckbox>
                </Form.Item>
            );
    }
});