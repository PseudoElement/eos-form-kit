import React from "react";
import { Form, SmartTextArea } from "@eos/rc-controls";
import IField from "./IField";
import { BaseField } from "./BaseField";
import { Rule } from "rc-field-form/lib/interface";

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
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />);

    function getNew(props: IMultiText, ref: any, rules?: Rule[], required?: boolean) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <SmartTextArea placeholder={props.placeholder} width={"100%"} ref={ref} required={required} rows={props.rows ?? DEFAULT_ROWS} maxLength={props.maxLength} />
            </Form.Item>
        );
    }
    function getEdit(props: IMultiText, ref: any, rules?: Rule[], required?: boolean) {
        return getNew(props, ref, rules,required);
    }
    function getDisplay(props: IMultiText, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <SmartTextArea width={"100%"} ref={ref} rows={props.rows ?? DEFAULT_ROWS} readOnly />
            </Form.Item>
        );
    }
});