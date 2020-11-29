import React, { ReactElement } from "react";
import { Form, Input } from "@eos/rc-controls";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";
import { Rule } from "rc-field-form/lib/interface"
import { BaseField } from "./BaseField";

/**
 * Настройки текстового поля.
 */
export interface IText extends IField {
    /**Отрисовать иконку очистки поля. */
    allowClear?: boolean;
    /**Максимальное количество символов. */
    maxLength?: number;
    /**Дополнительный текст в иконке по наведению. */
    additionalText?: string;
    /**Иконка с дополнительным текстом. */
    icon?: ReactElement;
}

/**
 * Текстовое поле.
 */
export const Text = React.forwardRef<any, IText>((props: IText, ref) => {
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />)

    function getSuffix(props: IText) {
        return props.additionalText != undefined && props.additionalText != null && props.additionalText != "" ?
            FieldsHelper.getInputSuffix(props.additionalText, props.icon) :
            undefined;
    }
    function getNew(props: IText, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <Input value={props.value} suffix={getSuffix(props)} style={{ width: "100%" }} ref={ref} required={props.required} allowClear={props.allowClear} maxLength={props.maxLength} />
            </Form.Item>
        );
    }
    function getEdit(props: IText, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: IText) {
        return FieldsHelper.getDisplayField(props.label, props.name, props.value, getSuffix(props));
    }
});