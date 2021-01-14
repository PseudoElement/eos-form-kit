import { Form, SmartCheckbox as RcCheckbox } from "@eos/rc-controls";
import React from "react";
import { BaseField } from "./BaseField";
import IField from "./IField";
import { Rule } from "rc-field-form/lib/interface";

/**Настройки поля галочки. */
export interface ICheckbox extends IField {
    /**Текст рядом с галочкой. */
    description?: string;
}

/**
 * Поле галочка.
 */
export const Checkbox = React.forwardRef<any, ICheckbox>((props: ICheckbox, ref: any) => {
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />);

    function getNew(props: ICheckbox, ref: any, rules?: Rule[]) {
        return (
            <Form.Item valuePropName={ref ? "checked" : "checked"} label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <RcCheckbox>{props.description}</RcCheckbox>
            </Form.Item>
        );
    }
    function getEdit(props: ICheckbox, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: ICheckbox, ref: any, rules?: Rule[]) {
        return (
            <Form.Item valuePropName={ref ? "checked" : "checked"} label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <RcCheckbox readOnly={true}>{props.description}</RcCheckbox>
            </Form.Item>
        );
    }
});