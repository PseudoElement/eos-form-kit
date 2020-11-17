import React, { ReactElement, ReactNode } from "react";
import { Form, Input } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

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
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    const suffix: ReactNode | undefined = props.additionalText != undefined && props.additionalText != null && props.additionalText != "" ?
        FieldsHelper.getInputSuffix(props.additionalText, props.icon) :
        undefined;

    switch (props.mode) {
        case FormMode.display:
            return FieldsHelper.getDisplayField(props.label, props.name, props.value, suffix);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <Input value={props.value} suffix={suffix} style={{ width: "100%" }} ref={ref} required={props.required} allowClear={props.allowClear} maxLength={props.maxLength} />
                </Form.Item>
            );
    }
});