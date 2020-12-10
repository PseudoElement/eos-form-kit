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
    /**Значение поля по умолчанию. */
    defaultValue?: string;
    /**Вызовется, когда значение поля изменится. */
    onChange?(changedValue?: string, event?: any): void;
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
                <Input onChange={onChange} value={props.value} defaultValue={props.defaultValue} suffix={getSuffix(props)} style={{ width: "100%" }} ref={ref} required={props.required} allowClear={props.allowClear} maxLength={props.maxLength} />
            </Form.Item>
        );
    }
    function getEdit(props: IText, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: IText) {
        return FieldsHelper.getDisplayField(props.label, props.name, props.value, getSuffix(props), props.defaultValue, props.onChange);
    }
    function onChange(event?: any) {
        if (props.onChange) {
            props.onChange(event?.target?.value || "", event);
        }
    }
});