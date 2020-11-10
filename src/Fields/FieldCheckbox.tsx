import { Form, Checkbox } from "eos-webui-controls";
import React from "react";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";


export interface IFieldCheckbox extends IField {
    /**Текст рядом с галочкой. */
    description?: string;
}

/**
 * Поле галочка.
 */
const FieldCheckbox = React.forwardRef<any, IFieldCheckbox>((props: IFieldCheckbox) => {
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    switch (props.mode) {
        case FormMode.display:
            return (<Form.Item valuePropName="checked" label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <Checkbox disabled={true}>{props.description}</Checkbox>
            </Form.Item>);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item valuePropName="checked" label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <Checkbox>{props.description}</Checkbox>
                </Form.Item>
            );
    }
});
export default FieldCheckbox;